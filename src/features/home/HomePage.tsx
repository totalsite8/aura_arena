import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'
import { ChevronRight, Newspaper, Scale, ShieldCheck, Sparkles, Store } from 'lucide-react'
import { DoubtCloud } from '../../components/DoubtCloud'
import { Orb } from '../../components/Orb'
import { SearchBar } from '../../components/SearchBar'
import { QUICK_PICKS, TYPE_LABEL } from '../../data/suggestions'
import { useUi } from '../../stores/ui'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

const ROLES = [
  { icon: Newspaper, title: 'Исследователи', text: 'читают свежие обзоры' },
  { icon: Store, title: 'Поиск по магазинам', text: 'проверяет десятки предложений' },
  { icon: Scale, title: 'Аналитики', text: 'сравнивают честно' },
  { icon: ShieldCheck, title: 'Ревизоры', text: 'перепроверяют результат' },
]

export function HomePage() {
  const navigate = useNavigate()
  const setHowOpen = useUi((s) => s.setHowOpen)

  const go = (q: string) => navigate(`/search?q=${encodeURIComponent(q)}`)

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[calc(100dvh-64px)] flex-col overflow-hidden">
        <DoubtCloud />

        {/* сфера */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING, delay: 0.5 }}
          className="absolute right-[6%] top-[10%] z-10 flex flex-col items-center gap-2 sm:right-[9%] sm:top-[12%]"
        >
          <Orb />
          <p className="glass max-w-36 rounded-2xl px-3 py-1.5 text-center text-[11px] font-medium leading-tight text-muted">
            Кликни на меня, чтобы я всегда был под рукой
          </p>
        </motion.div>

        {/* центр: заголовок + ввод на ~2/3 высоты */}
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-start px-4 pt-[11vh] sm:justify-center sm:pt-0 sm:pb-[16vh]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.05 }}
            className="chip !bg-card !text-muted"
          >
            <Sparkles className="size-3.5 text-accent" />
            Умный поиск товаров и услуг
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.12 }}
            className="mt-4 max-w-2xl text-center text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.08]"
          >
            Один вопрос —<br />
            и <span className="gradient-text">лучшее предложение</span> найдено
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.2 }}
            className="mt-4 max-w-xl text-center text-sm leading-relaxed text-muted sm:text-base"
          >
            Мы собрали целую команду: исследователи, аналитики, ревизоры.
            Они проверяют десятки магазинов — и честно показывают лучший вариант.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.3 }}
            className="mt-8 w-full max-w-2xl"
          >
            <SearchBar size="lg" onSubmit={go} autoFocus={false} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs"
          >
            <span className="chip !text-good">Поиск бесплатный</span>
            <button
              type="button"
              onClick={() => setHowOpen(true)}
              className="chip transition-colors hover:!border-accent hover:!text-accent"
            >
              Как мы это делаем
              <ChevronRight className="size-3.5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.62 }}
            className="mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-faint">Попробовать:</span>
            {QUICK_PICKS.map((p) => (
              <button
                key={p.text}
                type="button"
                onClick={() => go(p.text)}
                className="chip transition-all hover:-translate-y-0.5 hover:!border-accent hover:!text-accent hover:shadow-[var(--glow-accent)]"
                title={TYPE_LABEL[p.type]}
              >
                {p.text}
              </button>
            ))}
          </motion.div>
        </div>

        {/* намёк на скролл */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 hidden justify-center pb-6 sm:flex"
        >
          <span className="flex flex-col items-center gap-1 text-[11px] font-semibold text-faint">
            кто проверяет вашу покупку
            <span className="h-6 w-px bg-gradient-to-b from-line to-transparent" />
          </span>
        </motion.div>
      </section>

      {/* ---------- Команда под капотом ---------- */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ROLES.map((r, i) => (
            <motion.button
              key={r.title}
              type="button"
              onClick={() => setHowOpen(true)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...SPRING, delay: i * 0.08 }}
              className="glass-card group rounded-3xl p-4 text-left transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <span className="grid size-10 place-items-center rounded-2xl bg-accent/12 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <r.icon className="size-5" />
              </span>
              <p className="mt-3 text-sm font-extrabold">{r.title}</p>
              <p className="mt-0.5 text-xs text-muted">{r.text}</p>
            </motion.button>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-faint">
          Маркетплейсам всё равно, переплатите вы или нет. Нам — нет.
        </p>
      </section>
    </div>
  )
}
