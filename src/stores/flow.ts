import { create } from 'zustand'
import type {
  FlowPhase,
  Lane,
  ProcEvent,
  QueryType,
  Question,
  ResultPayload,
} from '../types'
import { classifyQuery } from '../lib/classify'
import { normalize } from '../lib/normalize'
import { makeRng } from '../lib/random'
import { buildQuestions } from '../data/questions'
import { buildScript } from '../data/scripts'
import {
  buildCategoryResult,
  buildExactResult,
  buildGiftResult,
  buildServiceBids,
} from '../data/offers'

interface PendingItem {
  at: number
  type: 'event' | 'status'
  laneId?: string
  laneTitle?: string
  icon?: string
  text: string
  ekind?: ProcEvent['kind']
}

interface FlowState {
  runKey: string | null
  query: string
  qtype: QueryType | null
  phase: FlowPhase
  questions: Question[]
  qIndex: number
  answers: Record<string, string>

  lanes: Lane[]
  events: ProcEvent[]
  doneLaneIds: string[]
  statusText: string
  progress: number
  fast: boolean

  payload: ResultPayload | null
  totalFound: number
  finishedSeconds: number

  ensure: (query: string, fast: boolean) => void
  start: (query: string, fast: boolean) => void
  answer: (qid: string, value: string) => void
  skipQuestions: () => void
  speedUp: () => void
  skipToEnd: () => void
  reset: () => void
}

let intervalHandle: ReturnType<typeof setInterval> | null = null
let vtime = 0
let lastReal = 0
let factor = 1
let pending: PendingItem[] = []
let total = 1
let eventId = 0

function stopEngine() {
  if (intervalHandle !== null) {
    clearInterval(intervalHandle)
    intervalHandle = null
  }
}

export const useFlow = create<FlowState>((set, get) => {
  function finalize(fast: boolean) {
    const st = get()
    const query = st.query
    const type = st.qtype
    if (!type) return
    const answers = st.answers
    const key = type + '::' + normalize(query)

    // totalFound детерминирован и одинаков и в скрипте, и в выдаче
    const totalFound = makeRng('totals::' + key).int(38, 64)

    let payload: ResultPayload
    let hero: import('../types').ProductOffer | undefined
    let bids: import('../types').ServiceBid[] | undefined
    if (type === 'gift_search') {
      const r = buildGiftResult(query, answers)
      payload = { kind: 'gift', hero: r.hero, directions: r.directions, totalFound }
      hero = r.hero
    } else if (type === 'service_search') {
      const r = buildServiceBids(query, answers)
      const avg = Math.round(r.bids.reduce((s, b) => s + b.estimatedPrice, 0) / r.bids.length)
      payload = {
        kind: 'service',
        taskRows: r.taskRows,
        bids: r.bids,
        companiesFound: totalFound,
        companiesSent: Math.min(5, r.bids.length),
        warnings: [
          'Некоторые компании указывают цену без учёта всех работ — попросите письменную смету',
          'Доставка и подъём материалов часто оплачиваются отдельно',
          'Финальная цена часто зависит от осмотра — это нормально',
          'Гарантию лучше попросить письменно, в договоре',
        ],
        avgPrice: avg,
      }
      bids = r.bids
    } else if (type === 'category_search') {
      const r = buildCategoryResult(query, answers)
      const stores = new Set([r.hero, ...r.offers].map((o) => o.store)).size
      payload = { kind: 'product', hero: r.hero, offers: r.offers, totalFound, storesCount: stores }
      hero = r.hero
    } else {
      const r = buildExactResult(query)
      const stores = new Set([r.hero, ...r.offers].map((o) => o.store)).size
      payload = { kind: 'product', hero: r.hero, offers: r.offers, totalFound, storesCount: stores }
      hero = r.hero
    }

    const script = buildScript({ type, query, answers, hero, bids, totalFound })

    pending = []
    script.lanes.forEach((lane) => {
      lane.events.forEach((e) => {
        pending.push({
          at: e.at,
          type: 'event',
          laneId: lane.id,
          laneTitle: lane.title,
          icon: lane.icon,
          text: e.text,
          ekind: e.kind,
        })
      })
    })
    script.status.forEach((s) => pending.push({ at: s.at, type: 'status', text: s.text }))
    pending.sort((a, b) => a.at - b.at)

    total = script.totalMs
    vtime = 0
    factor = fast ? 6 : 1
    lastReal = performance.now()
    stopEngine()

    set({
      phase: 'processing',
      lanes: script.lanes,
      events: [],
      doneLaneIds: [],
      statusText: script.status[0]?.text ?? 'Начинаю…',
      progress: 0,
      payload,
      totalFound,
      finishedSeconds: Math.round(script.totalMs / 1000),
    })

    intervalHandle = setInterval(tick, 60)
  }

  function fire(item: PendingItem) {
    const st = get()
    if (item.type === 'status') {
      set({ statusText: item.text })
      return
    }
    const lane = st.lanes.find((l) => l.id === item.laneId)
    const isLast = lane ? lane.events[lane.events.length - 1].text === item.text : false
    const ev: ProcEvent = {
      id: ++eventId,
      laneId: item.laneId ?? '',
      laneTitle: item.laneTitle ?? '',
      icon: item.icon ?? 'Sparkles',
      text: item.text,
      kind: item.ekind ?? 'info',
      at: item.at,
    }
    set({
      events: [...st.events, ev],
      doneLaneIds: isLast && !st.doneLaneIds.includes(ev.laneId) ? [...st.doneLaneIds, ev.laneId] : st.doneLaneIds,
    })
  }

  function tick() {
    const now = performance.now()
    const dt = now - lastReal
    lastReal = now
    vtime += dt * factor

    while (pending.length && pending[0].at <= vtime) {
      fire(pending.shift()!)
    }

    const progress = Math.min(1, vtime / total)
    if (progress !== get().progress) set({ progress })

    if (pending.length === 0 && vtime >= total) {
      complete()
    }
  }

  function complete() {
    stopEngine()
    set({ phase: 'results', progress: 1 })
  }

  return {
    runKey: null,
    query: '',
    qtype: null,
    phase: 'idle',
    questions: [],
    qIndex: 0,
    answers: {},

    lanes: [],
    events: [],
    doneLaneIds: [],
    statusText: '',
    progress: 0,
    fast: false,

    payload: null,
    totalFound: 0,
    finishedSeconds: 10,

    ensure: (query, fast) => {
      const st = get()
      const key = normalize(query)
      if (st.runKey === key && st.phase !== 'idle') return
      get().start(query, fast)
    },

    start: (query, fast) => {
      stopEngine()
      const q = query.trim()
      const type = classifyQuery(q)
      if (!type) {
        set({
          runKey: normalize(q),
          query: q,
          qtype: null,
          phase: 'unknown',
          questions: [],
          answers: {},
          qIndex: 0,
          fast,
          events: [],
          doneLaneIds: [],
          progress: 0,
          payload: null,
        })
        return
      }
      const questions = buildQuestions(type, q)
      set({
        runKey: normalize(q),
        query: q,
        qtype: type,
        phase: questions.length ? 'questions' : 'processing',
        questions,
        qIndex: 0,
        answers: {},
        fast,
        events: [],
        doneLaneIds: [],
        lanes: [],
        progress: 0,
        payload: null,
        statusText: 'Понимаю задачу…',
      })
      if (!questions.length) finalize(fast)
    },

    answer: (qid, value) => {
      const st = get()
      const answers = { ...st.answers, [qid]: value }
      const next = st.qIndex + 1
      if (next >= st.questions.length) {
        set({ answers, qIndex: next })
        finalize(st.fast)
      } else {
        set({ answers, qIndex: next })
      }
    },

    skipQuestions: () => {
      finalize(get().fast)
    },

    speedUp: () => {
      factor = 6
    },

    skipToEnd: () => {
      while (pending.length) fire(pending.shift()!)
      complete()
    },

    reset: () => {
      stopEngine()
      set({
        runKey: null,
        query: '',
        qtype: null,
        phase: 'idle',
        questions: [],
        qIndex: 0,
        answers: {},
        lanes: [],
        events: [],
        doneLaneIds: [],
        statusText: '',
        progress: 0,
        payload: null,
      })
    },
  }
})
