import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DOUBT_PHRASES } from '../data/suggestions'
import { makeRng } from '../lib/random'

interface Bubble {
  id: number
  text: string
  x: number // vw %
  y: number // vh %
  rot: number
  resolved: boolean
  born: number
}

/** Зоны вокруг центра экрана, чтобы не перекрывать строку ввода */
const ZONES = [
  { x: [2, 16], y: [12, 30] },
  { x: [2, 18], y: [52, 72] },
  { x: [72, 86], y: [10, 30] },
  { x: [70, 86], y: [50, 72] },
  { x: [30, 46], y: [8, 18] },
  { x: [52, 68], y: [10, 20] },
  { x: [8, 22], y: [34, 48] },
  { x: [68, 84], y: [32, 48] },
]

const MAX_DESKTOP = 6
const MAX_MOBILE = 3
const LIFE_MS = 6400
const SPAWN_MS = 2400

let bubbleId = 0

/**
 * «Облако сомнений»: по экрану появляются живые фразы, которые крутятся в голове
 * у людей при выборе покупки. Часть из них «разрешается» галочкой —
 * именно с этими вопросами Aura и работает.
 */
export function DoubtCloud() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const rngRef = useRef(makeRng('doubts' + Math.floor(Math.random() * 1e9)))
  const phraseIdx = useRef(Math.floor(Math.random() * DOUBT_PHRASES.length))
  const [max, setMax] = useState(MAX_DESKTOP)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const apply = () => setMax(mq.matches ? MAX_MOBILE : MAX_DESKTOP)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const spawn = window.setInterval(() => {
      setBubbles((cur) => {
        if (cur.length >= max) return cur
        const rng = rngRef.current
        phraseIdx.current = (phraseIdx.current + rng.int(1, 5)) % DOUBT_PHRASES.length
        const free = ZONES.filter((z) => !cur.some((b) => Math.abs(b.x - z.x[0]) < 9 && Math.abs(b.y - z.y[0]) < 12))
        const zone = rng.pick(free.length ? free : ZONES)
        const b: Bubble = {
          id: ++bubbleId,
          text: DOUBT_PHRASES[phraseIdx.current],
          x: rng.int(zone.x[0], zone.x[1]),
          y: rng.int(zone.y[0], zone.y[1]),
          rot: rng.int(-4, 4),
          resolved: rng.chance(0.34),
          born: Date.now(),
        }
        return [...cur, b]
      })
    }, SPAWN_MS)

    const killer = window.setInterval(() => {
      const now = Date.now()
      setBubbles((cur) => (cur.some((b) => now - b.born > LIFE_MS) ? cur.filter((b) => now - b.born <= LIFE_MS) : cur))
    }, 800)

    return () => {
      window.clearInterval(spawn)
      window.clearInterval(killer)
    }
  }, [max])

  const mobile = max === MAX_MOBILE

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <AnimatePresence>
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0.88, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -16 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
            className="absolute"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            <div
              className={`glass rounded-2xl rounded-bl-sm px-3.5 py-2 ${
                mobile ? 'text-[11px]' : 'text-[13px]'
              } font-medium italic text-muted shadow-sm`}
              style={{ transform: `rotate(${b.rot}deg)`, maxWidth: mobile ? 150 : 210 }}
            >
              {b.text}
              {b.resolved && <span className="ml-1.5 font-bold not-italic text-good">✓</span>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
