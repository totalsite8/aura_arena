import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Gift, LayoutGrid, ShoppingBag, Wrench } from 'lucide-react'
import { getSuggestions } from '../lib/suggest'
import { normalize } from '../lib/normalize'
import { ROTATING_EXAMPLES, TYPE_LABEL } from '../data/suggestions'
import type { QueryType, SuggestionItem } from '../types'

const TYPE_ICON: Record<QueryType, typeof Gift> = {
  exact_product: ShoppingBag,
  category_search: LayoutGrid,
  gift_search: Gift,
  service_search: Wrench,
}

interface Row {
  kind: 'header' | 'item'
  label?: string
  item?: SuggestionItem
}

function highlight(text: string, q: string) {
  const n = normalize(text)
  const idx = n.indexOf(normalize(q))
  if (idx < 0 || !q) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <span className="text-accent">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </span>
  )
}

export function SearchBar({
  size = 'lg',
  initial = '',
  autoFocus = false,
  onSubmit,
}: {
  size?: 'lg' | 'sm'
  initial?: string
  autoFocus?: boolean
  onSubmit: (q: string) => void
}) {
  const [value, setValue] = useState(initial)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [exampleIdx, setExampleIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  const items = useMemo(() => getSuggestions(value), [value])

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    let lastType: QueryType | null = null
    for (const item of items) {
      if (item.type !== lastType) {
        out.push({ kind: 'header', label: TYPE_LABEL[item.type] })
        lastType = item.type
      }
      out.push({ kind: 'item', item })
    }
    return out
  }, [items])

  // вращающиеся примеры в пустой строке
  useEffect(() => {
    const t = setInterval(() => setExampleIdx((i) => (i + 1) % ROTATING_EXAMPLES.length), 3400)
    return () => clearInterval(t)
  }, [])

  // глобальный фокус: Ctrl/⌘+K или «/»
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    setValue(initial)
  }, [initial])

  // закрытие по клику вне
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const itemRows = rows.filter((r) => r.kind === 'item')

  function submit(text: string) {
    const q = text.trim()
    if (!q) return
    setOpen(false)
    setActive(-1)
    inputRef.current?.blur()
    onSubmit(q)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      const dir = e.key === 'ArrowDown' ? 1 : -1
      setActive((a) => (a + dir + itemRows.length) % itemRows.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && active >= 0 && itemRows[active]?.item) submit(itemRows[active].item!.text)
      else submit(value)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActive(-1)
    }
  }

  const isLg = size === 'lg'
  let itemCounter = -1

  return (
    <div ref={boxRef} className="relative w-full">
      <div
        className={[
          'glass glass-hairline relative flex items-center gap-2 rounded-full transition-shadow duration-300',
          'shadow-[var(--shadow-lift)] focus-within:shadow-[var(--glow-accent)]',
          isLg ? 'py-2 pl-5 pr-2 sm:pl-6' : 'py-1.5 pl-4 pr-1.5',
        ].join(' ')}
      >
        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setOpen(true)
              setActive(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={open && items.length > 0}
            aria-label="Что найти"
            aria-autocomplete="list"
            className={[
              'w-full bg-transparent font-medium text-ink outline-none placeholder:text-transparent',
              isLg ? 'py-3 text-base sm:text-lg' : 'py-2 text-sm',
            ].join(' ')}
            placeholder="Что найти?"
          />
          {value === '' && (
            <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={exampleIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className={`truncate text-muted ${isLg ? 'text-base sm:text-lg' : 'text-sm'}`}
                >
                  Что найти? Например: {ROTATING_EXAMPLES[exampleIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>

        {isLg && (
          <kbd className="hidden shrink-0 items-center gap-1 rounded-lg border border-line bg-card-2/70 px-2 py-1 text-[11px] font-semibold text-muted md:flex">
            Ctrl K
          </kbd>
        )}

        <button
          type="button"
          onClick={() => submit(active >= 0 && open && itemRows[active]?.item ? itemRows[active].item!.text : value)}
          aria-label="Найти"
          className={[
            'grid shrink-0 place-items-center rounded-full bg-accent text-white shadow-[var(--glow-accent)] transition-all hover:bg-accent-strong active:scale-95',
            value ? 'opacity-100' : 'opacity-60',
            isLg ? 'size-11' : 'size-9',
          ].join(' ')}
        >
          <ArrowUp className="size-5" strokeWidth={2.4} />
        </button>
      </div>

      <AnimatePresence>
        {open && items.length > 0 && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="glass glass-hairline absolute inset-x-0 top-full z-40 mt-3 max-h-[min(24rem,60vh)] overflow-y-auto rounded-3xl p-2 shadow-2xl"
          >
            <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-faint">
              {value ? 'Подходящие запросы' : 'Попробуйте, например'}
            </p>
            {rows.map((row, i) => {
              if (row.kind === 'header') {
                return i === 0 ? null : (
                  <div key={`h-${row.label}-${i}`} className="mx-3 mb-1 mt-2 border-t border-line pt-2 text-[11px] font-bold uppercase tracking-wider text-faint">
                    {row.label}
                  </div>
                )
              }
              itemCounter += 1
              const idx = itemCounter
              const item = row.item!
              const Icon = TYPE_ICON[item.type]
              const isActive = idx === active
              return (
                <button
                  key={item.text}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => submit(item.text)}
                  className={[
                    'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors',
                    isActive ? 'bg-card-2' : 'hover:bg-card-2/60',
                  ].join(' ')}
                >
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-xl transition-colors ${
                      isActive ? 'bg-accent text-white' : 'bg-card-2 text-muted'
                    }`}
                  >
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{highlight(item.text, value)}</span>
                  {isActive && <span className="hidden shrink-0 text-[11px] font-semibold text-faint sm:block">Enter</span>}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
