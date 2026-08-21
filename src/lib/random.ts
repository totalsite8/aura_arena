/** Детерминированный генератор: один и тот же запрос даёт одинаковые «случайные» данные. */

export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Rng {
  next: () => number
  int: (min: number, max: number) => number
  pick: <T>(arr: readonly T[]) => T
  take: <T>(arr: readonly T[], n: number) => T[]
  chance: (p: number) => boolean
}

export function makeRng(key: string): Rng {
  const next = mulberry32(hashString(key))
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    take: (arr, n) => {
      const copy = [...arr]
      const out: typeof copy = []
      while (copy.length && out.length < n) {
        out.push(copy.splice(Math.floor(next() * copy.length), 1)[0])
      }
      return out
    },
    chance: (p) => next() < p,
  }
}

/** Красивое округление цен: 74312 → 74 300 / 74 990 в зависимости от шага */
export function roundPrice(v: number): number {
  if (v >= 10000) return Math.round(v / 100) * 100 - 10
  if (v >= 1000) return Math.round(v / 50) * 50 - 10
  return Math.max(90, Math.round(v / 10) * 10 - 10)
}
