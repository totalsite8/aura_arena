import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Laptop, Moon, Sun, Zap } from 'lucide-react'
import { Toaster } from 'sonner'
import { OrbMark } from './components/Orb'
import { HomePage } from './features/home/HomePage'
import { SearchPage } from './features/search/SearchPage'
import { PointsPage } from './features/wallet/PointsPage'
import { SmartLinkPage } from './features/smartlink/SmartLinkPage'
import { InstallModal } from './features/pwa/InstallModal'
import { HowItWorksModal } from './components/HowItWorksModal'
import { usePoints } from './stores/points'
import { useTheme, type ThemeMode } from './stores/theme'
import { useUi } from './stores/ui'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

function ThemeMenu() {
  const mode = useTheme((s) => s.mode)
  const setMode = useTheme((s) => s.setMode)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const options: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
    { id: 'system', label: 'Системная', icon: Laptop },
    { id: 'light', label: 'Светлая', icon: Sun },
    { id: 'dark', label: 'Тёмная', icon: Moon },
  ]
  const Current = options.find((o) => o.id === mode)!.icon

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Сменить тему"
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-full border border-line bg-card text-muted transition-colors hover:text-ink"
      >
        <Current className="size-4.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={SPRING}
            className="glass glass-hairline absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl p-1.5 shadow-xl"
          >
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setMode(o.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  mode === o.id ? 'bg-accent/12 text-accent' : 'text-muted hover:bg-card-2 hover:text-ink'
                }`}
              >
                <o.icon className="size-4" />
                <span className="flex-1 text-left">{o.label}</span>
                {mode === o.id && <Check className="size-4" strokeWidth={3} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PointsPill() {
  const balance = usePoints((s) => s.balance)
  return (
    <Link
      to="/points"
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-2 text-sm font-extrabold text-point transition-colors hover:border-point/50"
      title="Ваши баллы"
    >
      <Zap className="size-4 fill-point" />
      <span className="tabular-nums">{balance.toLocaleString('ru-RU')}</span>
    </Link>
  )
}

function Header() {
  const setHowOpen = useUi((s) => s.setHowOpen)
  return (
    <header className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Aura — на главную">
          <OrbMark size={30} />
          <span className="text-lg font-extrabold tracking-tight">Aura</span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 sm:flex" aria-label="Основная навигация">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-bold transition-colors ${isActive ? 'bg-accent/12 text-accent' : 'text-muted hover:text-ink'}`
            }
          >
            Поиск
          </NavLink>
          <NavLink
            to="/points"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-bold transition-colors ${isActive ? 'bg-accent/12 text-accent' : 'text-muted hover:text-ink'}`
            }
          >
            Баллы
          </NavLink>
          <button
            type="button"
            onClick={() => setHowOpen(true)}
            className="rounded-full px-4 py-2 text-sm font-bold text-muted transition-colors hover:text-ink"
          >
            Как это работает
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <PointsPill />
          <ThemeMenu />
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const setHowOpen = useUi((s) => s.setHowOpen)
  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <OrbMark size={26} />
            <div>
              <p className="text-sm font-extrabold">Aura</p>
              <p className="text-xs text-muted">Один вопрос — и лучшее предложение найдено. Бесплатно.</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-muted" aria-label="Ссылки в подвале">
            <Link to="/" className="transition-colors hover:text-accent">Поиск</Link>
            <Link to="/points" className="transition-colors hover:text-accent">Баллы</Link>
            <button type="button" onClick={() => setHowOpen(true)} className="transition-colors hover:text-accent">
              Как это работает
            </button>
          </nav>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-faint">
          Демонстрационный прототип: магазины, цены и компании — примеры. Рекомендации не являются публичной офертой.
        </p>
      </div>
    </footer>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* лёгкий фон-аврора вместо тяжёлого 3D */}
      <div className="aurora-stage" aria-hidden>
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
      </div>
      <div className="noise-overlay" aria-hidden />

      <ScrollToTop />
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/points" element={<PointsPage />} />
          <Route path="/smart-link/demo" element={<SmartLinkPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />

      <InstallModal />
      <HowItWorksModal />
      <Toaster position="bottom-center" gap={8} toastOptions={{ className: 'glass !rounded-2xl' }} />
    </div>
  )
}
