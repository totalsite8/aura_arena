import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'

const SPRING = { type: 'spring', stiffness: 100, damping: 15 } as const

/* ------------------------------- Tooltip ------------------------------- */

export function Tip({ label, children, side = 'top' }: { label: string; children: ReactNode; side?: 'top' | 'bottom' }) {
  return (
    <span className="group/tip relative inline-flex items-center" tabIndex={0}>
      {children}
      <span
        role="tooltip"
        className={[
          'pointer-events-none absolute left-1/2 z-50 w-56 -translate-x-1/2 rounded-2xl glass glass-hairline px-3.5 py-2.5',
          'text-left text-xs font-medium leading-relaxed text-ink shadow-lg',
          'opacity-0 transition-all duration-200 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100',
          side === 'top' ? 'bottom-full mb-2 translate-y-1 group-hover/tip:translate-y-0 group-focus-within/tip:translate-y-0' : 'top-full mt-2 -translate-y-1 group-hover/tip:translate-y-0 group-focus-within/tip:translate-y-0',
        ].join(' ')}
      >
        {label}
      </span>
    </span>
  )
}

/* ------------------------------ Accordion ------------------------------ */

export function Expandable({
  icon,
  title,
  sub,
  children,
  defaultOpen = false,
}: {
  icon?: ReactNode
  title: string
  sub?: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const open = useDisclosure(defaultOpen)
  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <button
        type="button"
        onClick={open.toggle}
        aria-expanded={open.value}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-card-2/50"
      >
        {icon && <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-card-2 text-accent">{icon}</span>}
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold sm:text-base">{title}</span>
          {sub && <span className="mt-0.5 block truncate text-xs text-muted">{sub}</span>}
        </span>
        <motion.span animate={{ rotate: open.value ? 180 : 0 }} transition={SPRING} className="text-muted">
          <ChevronDown className="size-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open.value && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function useDisclosure(initial = false) {
  const [value, setValue] = useState(initial)
  return { value, toggle: () => setValue((v) => !v), open: () => setValue(true), close: () => setValue(false) }
}

/* -------------------------------- Modal -------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)

    // Блокируем прокрутку фона, пока окно открыто
    const { overflow: prevOverflow, paddingRight: prevPadding } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={SPRING}
            className={[
              'glass glass-hairline relative my-auto max-h-[calc(100dvh-2rem)] w-full overscroll-contain overflow-y-auto rounded-[28px] p-6 shadow-2xl sm:p-8',
              wide ? 'max-w-2xl' : 'max-w-md',
            ].join(' ')}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-card-2 hover:text-ink"
            >
              <X className="size-5" />
            </button>
            {title && <h2 className="pr-10 text-xl font-extrabold tracking-tight">{title}</h2>}
            <div className={title ? 'mt-4' : ''}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------- Buttons ------------------------------- */

export function PrimaryButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-white',
        'shadow-[var(--glow-accent)] transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-accent',
        className,
      ].join(' ')}
    >
      {children}
    </motion.button>
  )
}

export function GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-2xl border border-line bg-card px-5 py-3 text-sm font-bold text-ink',
        'transition-colors hover:bg-card-2 focus-visible:outline-2 focus-visible:outline-accent',
        className,
      ].join(' ')}
    >
      {children}
    </motion.button>
  )
}
