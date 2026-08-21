import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, FastForward, ListChecks, Zap } from 'lucide-react'
import { useFlow } from '../stores/flow'
import { stamp } from '../data/scripts'
import { DynIcon } from './Icon'
import type { EventKind, Lane, ProcEvent } from '../types'

const DOT: Record<EventKind, string> = {
  info: 'bg-muted/60',
  found: 'bg-accent shadow-[0_0_8px_var(--accent)]',
  warn: 'bg-warn',
  done: 'bg-good',
}

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

function LaneCard({ lane, events, done, frozen }: { lane: Lane; events: ProcEvent[]; done: boolean; frozen: boolean }) {
  const visible = events.slice(-3)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className={[
        'glass-card relative flex min-h-[118px] flex-col gap-2 rounded-3xl p-4 transition-shadow',
        done ? 'shadow-none' : 'shadow-[var(--shadow-soft)]',
      ].join(' ')}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
            done ? 'bg-good/15 text-good' : 'bg-accent/12 text-accent'
          }`}
        >
          <DynIcon name={lane.icon} className="size-5" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-bold">{lane.title}</span>
        {done ? (
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-good text-white">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        ) : (
          <span className="relative flex size-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-end gap-1 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((e) => (
            <motion.p
              key={e.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRING}
              className={`flex items-start gap-2 text-xs leading-snug ${
                e === visible[visible.length - 1] && !frozen
                  ? 'font-semibold text-ink'
                  : 'text-muted'
              } ${e.kind === 'warn' ? '!text-warn' : ''}`}
            >
              <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${DOT[e.kind]}`} />
              <span className="min-w-0">{e.text}</span>
            </motion.p>
          ))}
          {visible.length === 0 && <p className="text-xs text-faint">в очереди…</p>}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function ProcessPanel({ frozen = false }: { frozen?: boolean }) {
  const lanes = useFlow((s) => s.lanes)
  const events = useFlow((s) => s.events)
  const doneLaneIds = useFlow((s) => s.doneLaneIds)
  const statusText = useFlow((s) => s.statusText)
  const progress = useFlow((s) => s.progress)
  const fast = useFlow((s) => s.fast)
  const speedUp = useFlow((s) => s.speedUp)
  const skipToEnd = useFlow((s) => s.skipToEnd)

  const [feedOpen, setFeedOpen] = useState(true)
  const feedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = feedRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [events.length])

  const byLane = useMemo(() => {
    const map = new Map<string, ProcEvent[]>()
    for (const l of lanes) map.set(l.id, [])
    for (const e of events) map.get(e.laneId)?.push(e)
    return map
  }, [lanes, events])

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className="glass-card rounded-[28px] p-4 sm:p-6"
      aria-label="Что я сейчас делаю"
      aria-live="polite"
    >
      {/* шапка: статус + прогресс */}
      <div className="flex items-start gap-3">
        {!frozen ? (
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center">
            <svg className="spinner-ring size-7" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="var(--line)" strokeWidth="3" />
              <path
                d="M22 12a10 10 0 0 0-10-10"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-good/15 text-good">
            <Check className="size-5" strokeWidth={2.6} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.h2
              key={statusText}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-base font-extrabold tracking-tight sm:text-lg"
            >
              {statusText}
            </motion.h2>
          </AnimatePresence>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card-2">
            <motion.div
              className="shimmer-line h-full rounded-full"
              style={{ width: `${Math.round(progress * 100)}%` }}
              transition={SPRING}
            />
          </div>
        </div>
        {!frozen && !fast && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={speedUp}
              title="Ускорить анимацию"
              className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-card-2 hover:text-ink"
            >
              <FastForward className="size-5" />
            </button>
            <button
              type="button"
              onClick={skipToEnd}
              title="Показать результат сразу"
              className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-card-2 hover:text-ink"
            >
              <Zap className="size-5" />
            </button>
          </div>
        )}
      </div>

      {/* дорожки специалистов */}
      <div
        className={`mt-4 grid grid-cols-1 gap-3 ${
          lanes.length >= 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : lanes.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
        }`}
      >
        {lanes.map((lane) => (
          <LaneCard
            key={lane.id}
            lane={lane}
            events={byLane.get(lane.id) ?? []}
            done={doneLaneIds.includes(lane.id)}
            frozen={frozen}
          />
        ))}
      </div>

      {/* живая лента */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setFeedOpen((v) => !v)}
          aria-expanded={feedOpen}
          className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-card-2/60"
        >
          <ListChecks className="size-4 text-accent" />
          <span className="flex-1 text-sm font-bold">Что я сейчас делаю</span>
          <span className="text-xs text-muted">{events.length} событий</span>
          <motion.span animate={{ rotate: feedOpen ? 180 : 0 }} transition={SPRING}>
            <ChevronDown className="size-4 text-muted" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {feedOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SPRING}
              className="overflow-hidden"
            >
              <div ref={feedRef} className="mt-1 max-h-56 space-y-1 overflow-y-auto rounded-2xl bg-card-2/40 p-2.5 pr-2">
                <AnimatePresence initial={false}>
                  {events.map((e, i) => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={SPRING}
                      className="flex items-center gap-2.5 text-xs"
                    >
                      <span className="w-9 shrink-0 tabular-nums text-faint">{stamp(e.at)}</span>
                      <span className={`size-1.5 shrink-0 rounded-full ${DOT[e.kind]}`} />
                      <span className={`min-w-0 flex-1 ${i === events.length - 1 && !frozen ? 'font-semibold text-ink' : 'text-muted'} ${e.kind === 'warn' ? 'text-warn' : ''}`}>
                        {e.text}
                      </span>
                      <span className="hidden shrink-0 text-[10px] text-faint sm:block">{e.laneTitle}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
