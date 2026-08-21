import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  Check,
  Clock,
  FileText,
  Lock,
  Pencil,
  Phone,
  ShieldCheck,
  Star,
  Table2,
  TriangleAlert,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ServiceBid, ServicePayload } from '../../types'
import { formatPrice } from '../../lib/format'
import { Expandable, Modal, PrimaryButton, Tip } from '../ui/primitives'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

const BADGE_CLS: Record<ServiceBid['badges'][number]['tone'], string> = {
  good: '!text-good',
  warn: '!text-warn',
  info: '',
}

function BidCard({ bid, index, onChoose, chosen }: { bid: ServiceBid; index: number; onChoose: () => void; chosen: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...SPRING, delay: index * 0.1 }}
      className={[
        'glass-card flex flex-col gap-3 rounded-3xl p-4 sm:p-5',
        bid.recommended ? 'ring-1 ring-accent/45 shadow-[var(--glow-accent)]' : '',
        chosen ? '!ring-2 !ring-good' : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div
          className="grid size-11 shrink-0 place-items-center rounded-2xl text-lg font-extrabold text-white shadow-sm ring-1 ring-white/10"
          style={{ background: `linear-gradient(135deg, hsl(${(bid.companyName.charCodeAt(0) * 37) % 360} 58% 48%), hsl(${((bid.companyName.charCodeAt(0) * 37) % 360) + 60} 55% 36%))` }}
        >
          {bid.companyName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-extrabold tracking-tight">{bid.companyName}</h4>
            {bid.recommended && (
              <Tip label="Лучший баланс цены, рейтинга и гарантии. Не обязательно самый дешёвый — зато без сюрпризов.">
                <span className="badge-pulse inline-flex cursor-help items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-extrabold text-white">
                  <Star className="size-3.5 fill-white" />
                  Рекомендация Aura
                </span>
              </Tip>
            )}
            {chosen && (
              <span className="inline-flex items-center gap-1 rounded-full bg-good px-2.5 py-1 text-[11px] font-extrabold text-white">
                <Check className="size-3.5" strokeWidth={3} />
                Вы выбрали
              </span>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
            <Star className="size-3.5 fill-point text-point" />
            <b className="text-ink">{bid.rating.toFixed(1)}</b> · {bid.reviewsCount} отзывов ·
            <Clock className="size-3.5" /> ответили {bid.responseTime}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-extrabold tracking-tight tabular-nums sm:text-xl">{formatPrice(bid.estimatedPrice)}</p>
          <p className="text-[11px] text-muted">{bid.priceNote}</p>
        </div>
      </div>

      <p className="text-sm text-muted">{bid.comment}</p>

      <div className="flex flex-wrap gap-1.5">
        <span className="chip">
          <Clock className="size-3" /> {bid.term}
        </span>
        <span className="chip">
          <ShieldCheck className="size-3" /> гарантия {bid.warranty}
        </span>
        {bid.badges.map((b) => (
          <span key={b.label} className={`chip ${BADGE_CLS[b.tone]}`}>
            {b.label}
          </span>
        ))}
      </div>

      {bid.hiddenFeesNote && (
        <p className="flex items-start gap-2 rounded-2xl border border-warn/25 bg-warn/10 px-3.5 py-2.5 text-xs font-medium text-warn">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {bid.hiddenFeesNote}
        </p>
      )}

      <button
        type="button"
        onClick={onChoose}
        className={[
          'mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-bold transition-colors',
          chosen
            ? 'bg-good/15 text-good'
            : bid.recommended
              ? 'bg-accent text-white shadow-[var(--glow-accent)] hover:bg-accent-strong'
              : 'border border-line bg-card-2/60 hover:bg-accent hover:text-white',
        ].join(' ')}
      >
        {chosen ? (
          <>
            <Check className="size-4" strokeWidth={3} />
            Выбрана
          </>
        ) : (
          'Выбрать'
        )}
      </button>
    </motion.article>
  )
}

function CompareBids({ bids }: { bids: ServiceBid[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-faint">
            <th className="py-2 pr-3 font-bold">Компания</th>
            <th className="py-2 pr-3 font-bold">Цена</th>
            <th className="py-2 pr-3 font-bold">Рейтинг</th>
            <th className="py-2 pr-3 font-bold">Срок</th>
            <th className="py-2 pr-3 font-bold">Гарантия</th>
            <th className="py-2 font-bold">Доплаты</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((b) => (
            <tr key={b.id} className="border-t border-line">
              <td className="py-2.5 pr-3 font-bold">
                {b.companyName}
                {b.recommended && <span className="ml-1.5 text-[10px] font-extrabold uppercase text-accent">выбор Aura</span>}
              </td>
              <td className="py-2.5 pr-3 tabular-nums">{formatPrice(b.estimatedPrice)}</td>
              <td className="py-2.5 pr-3">{b.rating.toFixed(1)}</td>
              <td className="py-2.5 pr-3 text-muted">{b.term}</td>
              <td className="py-2.5 pr-3 text-muted">{b.warranty}</td>
              <td className="py-2.5">
                {b.hiddenFeesNote ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-warn">
                    <TriangleAlert className="size-3.5" /> возможны
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-good">
                    <BadgeCheck className="size-3.5" /> всё включено
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ServiceResults({ payload, query }: { payload: ServicePayload; query: string }) {
  const [chosen, setChosen] = useState<ServiceBid | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactShown, setContactShown] = useState(false)

  return (
    <div className="space-y-6">
      {/* Поняла задачу */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="glass-card glass-hairline rounded-[28px] p-5 sm:p-6"
        aria-label="Описание задачи"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-2xl bg-accent/12 text-accent">
            <FileText className="size-5" />
          </span>
          <h3 className="flex-1 text-base font-extrabold tracking-tight sm:text-lg">Поняла задачу</h3>
          <button
            type="button"
            onClick={() => toast('Поправить задачу (демо)', { description: 'В полной версии здесь можно будет отредактировать параметры.' })}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:text-accent"
          >
            <Pencil className="size-3.5" /> изменить
          </button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {payload.taskRows.map((r) => (
            <div key={r.label} className="rounded-2xl bg-card-2/50 px-3.5 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-faint">{r.label}</p>
              <p className="mt-0.5 text-sm font-bold">{r.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Отправила в {payload.companiesSent} проверенных компаний — ответили все. Средняя цена по ответам:{' '}
          <b className="text-ink">{formatPrice(payload.avgPrice)}</b>
        </p>
      </motion.section>

      {/* Предложения */}
      <div className="grid gap-3 lg:grid-cols-2">
        {payload.bids.map((bid, i) => (
          <BidCard
            key={bid.id}
            bid={bid}
            index={i}
            chosen={chosen?.id === bid.id}
            onChoose={() => setChosen(bid)}
          />
        ))}
      </div>

      {/* На что обратить внимание */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={SPRING}
        className="glass-card rounded-[28px] p-5 sm:p-6"
        aria-label="На что обратить внимание"
      >
        <h3 className="flex items-center gap-2 text-base font-extrabold tracking-tight">
          <TriangleAlert className="size-5 text-warn" />
          На что обратить внимание
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {payload.warnings.map((w) => (
            <li key={w} className="flex items-start gap-2 rounded-2xl bg-card-2/50 px-3.5 py-2.5 text-sm text-muted">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-good" />
              {w}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Полное сравнение */}
      <Expandable
        icon={<Table2 className="size-5" />}
        title="Полное сравнение компаний"
        sub="Цена, рейтинг, сроки, гарантия — в одной таблице"
      >
        <CompareBids bids={payload.bids} />
      </Expandable>

      {/* Модалка выбора */}
      <Modal open={!!chosen && !contactOpen} onClose={() => setChosen(null)} title={`Вы выбрали «${chosen?.companyName}»`}>
        <div className="space-y-4">
          <div className="rounded-3xl bg-card-2/60 p-4 text-sm">
            <div className="flex justify-between font-semibold">
              <span className="text-muted">Предварительная цена</span>
              <b>{chosen && formatPrice(chosen.estimatedPrice)}</b>
            </div>
            <div className="mt-1 flex justify-between font-semibold">
              <span className="text-muted">Срок</span>
              <b>{chosen?.term}</b>
            </div>
            <div className="mt-1 flex justify-between font-semibold">
              <span className="text-muted">Гарантия</span>
              <b>{chosen?.warranty}</b>
            </div>
          </div>
          <p className="flex items-start gap-2 text-sm text-muted">
            <Lock className="mt-0.5 size-4 shrink-0 text-accent" />
            Контакты компании откроются после подтверждения заявки — так «{chosen?.companyName}» поймёт,
            что вы реально готовы, и даст точную цену.
          </p>
          <PrimaryButton
            className="w-full"
            onClick={() => {
              setContactOpen(true)
              setContactShown(false)
            }}
          >
            Открыть контакт
          </PrimaryButton>
        </div>
      </Modal>

      {/* Модалка контакта (демо) */}
      <Modal
        open={contactOpen}
        onClose={() => {
          setContactOpen(false)
          setChosen(null)
        }}
        title={contactShown ? chosen?.companyName : 'Открываем контакт'}
      >
        <AnimatePresence mode="wait">
          {!contactShown ? (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-sm text-muted">
                Демо-режим: здесь компания подтверждает заявку, и только после этого открывается контакт.
                Никакой оплаты с вас — заявка бесплатна.
              </p>
              <PrimaryButton className="w-full" onClick={() => setContactShown(true)}>
                Показать, как будет
              </PrimaryButton>
            </motion.div>
          ) : (
            <motion.div key="shown" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="space-y-4">
              <div className="flex items-center gap-3 rounded-3xl bg-card-2/60 p-4">
                <span className="grid size-11 place-items-center rounded-2xl bg-good/15 text-good">
                  <Phone className="size-5" />
                </span>
                <div>
                  <p className="text-lg font-extrabold tracking-tight tabular-nums">+7 (9**) ***-42-17</p>
                  <p className="text-xs text-muted">менеджер «{chosen?.companyName}» — звоните с 9:00 до 21:00</p>
                </div>
              </div>
              <p className="text-xs text-faint">
                В полной версии здесь будет настоящий номер — после подтверждения заявки. По запросу «{query}».
              </p>
              <PrimaryButton
                className="w-full"
                onClick={() => {
                  toast.success('Заявка отмечена (демо)', { description: 'В полной версии компания получит уведомление.' })
                  setContactOpen(false)
                  setChosen(null)
                }}
              >
                Отлично
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  )
}
