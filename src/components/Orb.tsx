import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useUi } from '../stores/ui'

/**
 * Сфера Aura — лёгкий canvas-рендер (без WebGL/Three.js, ~3 КБ):
 * «северное сияние» внутри стеклянного шара: плывущие цветные пятна,
 * объёмное затемнение по краю, блик и внутренний ободок.
 * 60 fps, останавливается при prefers-reduced-motion.
 */

interface Blob {
  color: string // rgb части полупрозрачного градиента
  alpha: number
  radius: number // доля от диаметра
  fx: number
  fy: number
  px: number
  py: number
  ox: number
  oy: number
}

const BLOBS: Blob[] = [
  { color: '109,90,255', alpha: 0.95, radius: 0.66, fx: 0.9, fy: 1.15, px: 0.0, py: 1.3, ox: 0.0, oy: -0.06 },
  { color: '47,224,196', alpha: 0.85, radius: 0.58, fx: 1.27, fy: 0.83, px: 2.1, py: 4.0, ox: 0.1, oy: 0.1 },
  { color: '255,181,77', alpha: 0.7, radius: 0.52, fx: 0.72, fy: 1.42, px: 4.2, py: 2.2, ox: -0.12, oy: 0.14 },
  { color: '179,136,255', alpha: 0.75, radius: 0.62, fx: 1.5, fy: 0.62, px: 5.4, py: 0.6, ox: 0.14, oy: -0.12 },
  { color: '76,111,255', alpha: 0.6, radius: 0.5, fx: 0.58, fy: 1.7, px: 1.2, py: 3.1, ox: -0.05, oy: -0.16 },
]

export function Orb({ size = 76, withRing = true }: { size?: number; withRing?: boolean }) {
  const setInstallOpen = useUi((s) => s.setInstallOpen)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const S = Math.round(size * dpr)
    canvas.width = S
    canvas.height = S
    const R = S / 2

    let raf = 0
    const draw = (ms: number) => {
      const t = (ms / 1000) * 0.55
      ctx.clearRect(0, 0, S, S)
      ctx.save()

      // шар: клип по кругу
      ctx.beginPath()
      ctx.arc(R, R, R - 0.5, 0, Math.PI * 2)
      ctx.clip()

      // глубокое основание
      ctx.fillStyle = '#171233'
      ctx.fillRect(0, 0, S, S)

      // плывущие «авроры»
      ctx.globalCompositeOperation = 'lighter'
      for (const b of BLOBS) {
        const cx = R + (Math.sin(t * b.fx + b.px) * 0.33 + b.ox) * R
        const cy = R + (Math.cos(t * b.fy + b.py) * 0.33 + b.oy) * R
        const rr = b.radius * S
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, rr))
        g.addColorStop(0, `rgba(${b.color},${b.alpha})`)
        g.addColorStop(1, `rgba(${b.color},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, S, S)
      }
      ctx.globalCompositeOperation = 'source-over'

      // объём: мягкое затемнение к низу и правому краю
      const shade = ctx.createRadialGradient(R * 0.7, R * 0.62, R * 0.2, R, R, R * 1.15)
      shade.addColorStop(0, 'rgba(7,5,26,0)')
      shade.addColorStop(1, 'rgba(7,5,26,0.62)')
      ctx.fillStyle = shade
      ctx.fillRect(0, 0, S, S)

      // стеклянный блик слева сверху
      const spec = ctx.createRadialGradient(R * 0.62, R * 0.5, 0, R * 0.62, R * 0.5, R * 0.52)
      spec.addColorStop(0, 'rgba(255,255,255,0.85)')
      spec.addColorStop(0.45, 'rgba(255,255,255,0.18)')
      spec.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = spec
      ctx.fillRect(0, 0, S, S)

      // лёгкое «дыхание» яркости
      const breath = 0.06 + 0.05 * Math.sin(t * 2)
      const sheen = ctx.createRadialGradient(R, R, R * 0.1, R, R, R)
      sheen.addColorStop(0, `rgba(255,255,255,${breath})`)
      sheen.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = sheen
      ctx.fillRect(0, 0, S, S)

      // внутренний ободок (стеклянный край)
      ctx.restore()
      ctx.beginPath()
      ctx.arc(R, R, R - 0.8, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'
      ctx.lineWidth = Math.max(1, dpr * 0.75)
      ctx.stroke()

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [size, reduced])

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => setInstallOpen(true)}
      aria-label="Добавить Aura на главный экран"
      className="group relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      style={{ width: size, height: size }}
    >
      {withRing && (
        <span
          aria-hidden
          className="absolute -inset-[34%] rounded-full border border-dashed border-accent/50"
          style={{ animation: 'orb-ring-spin 24s linear infinite' }}
        >
          <span className="absolute left-1/2 top-[5%] size-[7px] -translate-x-1/2 rounded-full bg-accent-2 shadow-[0_0_10px_var(--accent-2)]" />
        </span>
      )}
      <span
        aria-hidden
        className="absolute -inset-[22%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(109,90,255,.45) 0%, rgba(47,224,196,.18) 55%, transparent 72%)',
          filter: 'blur(14px)',
        }}
      />
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="relative rounded-full transition-transform duration-500 group-hover:scale-[1.02] motion-safe:animate-[orb-idle-float_7s_ease-in-out_infinite]"
        style={{ width: size, height: size }}
      />
    </motion.button>
  )
}

export function OrbMark({ size = 30 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 30% 26%, rgba(255,255,255,.95) 0%, rgba(255,255,255,0) 34%), conic-gradient(from 120deg, #6d5aff, #2fe0c4, #ffb54d, #8d7dff, #6d5aff)',
        boxShadow: 'inset -4px -6px 12px rgba(23,12,92,.5), 0 4px 14px -2px rgba(109,90,255,.5)',
      }}
    />
  )
}
