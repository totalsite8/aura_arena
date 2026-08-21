import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, Building2, Clock, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'
import { OrbMark } from '../../components/Orb'
import { PrimaryButton } from '../../components/ui/primitives'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

/**
 * Демо-страница для исполнителя: «нулевое трение».
 * Без регистрации, без кабинета — пришла ссылка, посмотрел задачу, ответил ценой.
 */
export function SmartLinkPage() {
  const [price, setPrice] = useState('')
  const [sent, setSent] = useState<number | null>(null)

  const submit = () => {
    const value = parseInt(price.replace(/[^\d]/g, ''), 10)
    if (!value || value <= 0) {
      toast('Введите вашу цену', { description: 'Например: 85000' })
      return
    }
    setSent(value)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-64px-120px)] w-full max-w-lg flex-col px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="glass-card glass-hairline w-full rounded-[28px] p-6 sm:p-8"
      >
        <div className="flex items-center gap-2.5">
          <OrbMark size={26} />
          <span className="text-xs font-bold uppercase tracking-wider text-faint">Aura · новая заявка</span>
        </div>

        <AnimatePresence mode="wait">
          {sent === null ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -14 }} transition={SPRING}>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Новый заказ в вашем районе</h1>
              <p className="mt-1 text-sm text-muted">Клиент уже ждёт предложения. Ответьте ценой — без регистрации.</p>

              <dl className="mt-5 space-y-2">
                {[
                  { icon: Building2, k: 'Услуга', v: 'Остекление балкона' },
                  { icon: MapPin, k: 'Район', v: 'Ваш район (адрес сообщит клиент)' },
                  { icon: Clock, k: 'Срок', v: 'В течение месяца' },
                ].map((r) => (
                  <div key={r.k} className="flex items-center gap-3 rounded-2xl bg-card-2/50 px-4 py-3">
                    <r.icon className="size-4 shrink-0 text-accent" />
                    <dt className="w-14 shrink-0 text-xs font-bold uppercase tracking-wider text-faint">{r.k}</dt>
                    <dd className="text-sm font-semibold">{r.v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 rounded-2xl border border-line bg-card-2/40 px-4 py-3 text-sm text-muted">
                «Нужно остеклить стандартный балкон, важна гарантия и аккуратный монтаж».
              </p>

              <label className="mt-5 block">
                <span className="text-xs font-bold uppercase tracking-wider text-faint">Ваша цена, ₽</span>
                <input
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^\d\s]/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  placeholder="Например: 85 000"
                  className="mt-1.5 w-full rounded-2xl border border-line bg-card px-4 py-3.5 text-xl font-extrabold tabular-nums outline-none transition-shadow placeholder:text-faint focus:shadow-[var(--glow-accent)]"
                />
              </label>

              <PrimaryButton className="mt-4 w-full" onClick={submit}>
                <Send className="size-4" />
                Отправить цену
              </PrimaryButton>
              <p className="mt-3 text-center text-xs text-faint">
                Это займёт 10 секунд. Если клиент выберет вас — мы напишем сюда же.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={SPRING}
              className="flex flex-col items-center py-4 text-center"
            >
              <span className="grid size-16 place-items-center rounded-full bg-good/15 text-good">
                <BadgeCheck className="size-8" />
              </span>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Цена отправлена</h1>
              <p className="mt-1 text-sm text-muted">
                {sent.toLocaleString('ru-RU')} ₽ — передали клиенту вместе с другими предложениями.
              </p>
              <p className="mt-4 max-w-xs rounded-2xl bg-card-2/50 px-4 py-3 text-xs text-muted">
                Клиент видит все цены сравнением и выберет сам. О выборе сообщим здесь же — страницу можно закрыть.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(null)
                  setPrice('')
                }}
                className="mt-4 text-xs font-bold text-muted underline-offset-2 transition-colors hover:text-accent hover:underline"
              >
                Отправить другую цену
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-4 text-center text-xs text-faint">
        Демонстрация принципа «нулевого трения»: исполнителю не нужна регистрация и кабинет.
      </p>
    </div>
  )
}
