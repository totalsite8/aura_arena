import { useState } from 'react'
import { DynIcon } from './Icon'
import { productImage } from '../lib/productImage'

/**
 * Фотография товара. Показывает реальное фото из /img/products/,
 * а если его нет или оно не загрузилось — аккуратную градиентную
 * плитку с иконкой (прежний вид). Так ничего не ломается.
 */
export function ProductImage({
  title,
  icon,
  hue,
  className = '',
  iconClassName = 'size-16 sm:size-20',
}: {
  title?: string
  icon: string
  hue: number
  className?: string
  iconClassName?: string
}) {
  const src = title ? productImage(title) : undefined
  const [attempt, setAttempt] = useState(0)
  const candidates = src ? [src, src.replace(/\.jpg$/, '.png'), src.replace(/\.jpg$/, '.webp')] : []
  const showPhoto = src && attempt < candidates.length
  const currentSrc = candidates[attempt]

  return (
    <div
      className={`relative grid place-items-center overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/10 ${className}`}
      style={
        showPhoto
          ? undefined
          : {
              background: `radial-gradient(120% 120% at 20% 15%, hsl(${hue} 90% 88% / .9) 0%, hsl(${(hue + 40) % 360} 80% 78% / .55) 38%, hsl(${(hue + 90) % 360} 75% 62% / .45) 100%)`,
            }
      }
    >
      {showPhoto ? (
        <img
          src={currentSrc}
          alt={title}
          loading="lazy"
          onError={() => setAttempt((a) => a + 1)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div
            className="absolute -right-8 -top-8 size-36 rounded-full opacity-40 blur-2xl"
            style={{ background: `hsl(${(hue + 140) % 360} 85% 70%)` }}
          />
          <div className="absolute inset-0 dark:bg-black/35" />
          <DynIcon
            name={icon}
            className={`relative text-white drop-shadow-[0_10px_24px_rgba(23,12,92,0.45)] ${iconClassName}`}
            strokeWidth={1.4}
          />
        </>
      )}
    </div>
  )
}
