import { motion } from 'framer-motion'
import { useUi } from '../stores/ui'

/**
 * Сфера Aura — лёгкий CSS-элемент без WebGL:
 * парение, «дыхание», орбита. По клику — добавление на экран «Домой».
 */
export function Orb({ size = 76, withRing = true }: { size?: number; withRing?: boolean }) {
  const setInstallOpen = useUi((s) => s.setInstallOpen)
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => setInstallOpen(true)}
      aria-label="Добавить Aura на главный экран"
      className="orb glass-hairline rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      style={{ '--orb-size': `${size}px` } as React.CSSProperties}
    >
      {withRing && <span className="orb-ring" aria-hidden />}
      <span className="orb-soft" aria-hidden />
      <span className="orb-core" aria-hidden />
      <span className="orb-spec" aria-hidden />
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
