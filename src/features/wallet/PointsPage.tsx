import { motion } from 'framer-motion'
import { Copy, Gift, HandCoins, ShieldQuestion, ShoppingBag, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { usePoints } from '../../stores/points'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

const HOW = [
  {
    icon: ShoppingBag,
    title: 'Получайте за покупки',
    text: 'Баллы начисляются сами за покупки, найденные через Aura. Ничего включать не нужно.',
  },
  {
    icon: HandCoins,
    title: 'Тратьте на выгоду',
    text: 'Баллы уменьшают реальную цену следующих покупок — видно сразу в «Честном расчёте».',
  },
  {
    icon: Zap,
    title: 'Курс простой',
    text: '10 баллов ≈ 1 ₽ выгоды. Считаем и показываем автоматически, без формул.',
  },
]

export function PointsPage() {
  const balance = usePoints((s) => s.balance)
  const history = usePoints((s) => s.history)

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 pb-20 pt-8">
      {/* Баланс */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        aria-label="Ваш баланс"
        className="glass-hairline relative overflow-hidden rounded-[28px] p-7 text-white sm:p-9"
        style={{ background: 'linear-gradient(120deg, #4f3fe0 0%, #6354f0 45%, #0fbfa4 130%)' }}
      >
        <div className="absolute -right-10 -top-10 size-44 rounded-full bg-white/15 blur-2xl" />
        <p className="text-xs font-bold uppercase tracking-wider text-white/70">Баллы Aura</p>
        <p className="mt-2 text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl">
          {balance.toLocaleString('ru-RU')}
        </p>
        <p className="mt-1 text-sm font-semibold text-white/80">≈ {Math.round(balance / 10).toLocaleString('ru-RU')} ₽ выгоды на будущие покупки</p>
        <p className="mt-4 max-w-md text-[13px] leading-relaxed text-white/70">
          В связи с большим количеством пользователей мы ввели систему баллов. Баллы — это бесплатный бонус:
          сам поиск остаётся полностью бесплатным и всегда таким будет.
        </p>
      </motion.section>

      {/* Как это работает */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.08 }}
        className="glass-card rounded-[28px] p-5 sm:p-6"
      >
        <h2 className="flex items-center gap-2 text-base font-extrabold tracking-tight">
          <ShieldQuestion className="size-5 text-accent" />
          Как это работает
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {HOW.map((h) => (
            <div key={h.title} className="rounded-3xl bg-card-2/50 p-4">
              <span className="grid size-9 place-items-center rounded-xl bg-accent/12 text-accent">
                <h.icon className="size-4.5" />
              </span>
              <p className="mt-2.5 text-sm font-extrabold">{h.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{h.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Рефералка */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.16 }}
        className="glass-card glass-hairline flex flex-col items-start justify-between gap-4 rounded-[28px] p-5 sm:flex-row sm:items-center sm:p-6"
      >
        <div className="flex items-start gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-point/15 text-point">
            <Gift className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">Понравился поиск?</h2>
            <p className="mt-0.5 text-sm text-muted">
              Порекомендуй другу — получишь <b className="text-point">1 000 баллов</b>, когда он найдёт свою первую покупку.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const link = `${window.location.origin}/?from=friend`
            const done = () => toast.success('Ссылка скопирована (демо)', { description: link })
            if (navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(link).then(done).catch(done)
            } else {
              done()
            }
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-[var(--glow-accent)] transition-colors hover:bg-accent-strong"
        >
          <Copy className="size-4" />
          Поделиться
        </button>
      </motion.section>

      {/* История */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.24 }}
        className="glass-card rounded-[28px] p-5 sm:p-6"
        aria-label="История баллов"
      >
        <h2 className="text-base font-extrabold tracking-tight">История</h2>
        <ul className="mt-3 divide-y divide-line">
          {history.map((h) => (
            <li key={h.id} className="flex items-center gap-3 py-3 text-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-point/15 text-point">
                <Zap className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{h.text}</span>
                <span className="text-xs text-muted">{h.date}</span>
              </span>
              <span className="font-extrabold tabular-nums text-good">+{h.amount.toLocaleString('ru-RU')}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-faint">Дальше здесь появятся начисления за реальные покупки.</p>
      </motion.section>
    </div>
  )
}
