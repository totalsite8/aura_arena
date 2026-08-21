import { DynIcon } from './Icon'

/** Стильная абстрактная «фотография» товара: градиентная плитка с иконкой. Никаких чужих изображений. */
export function ProductImage({
  icon,
  hue,
  className = '',
  iconClassName = 'size-16 sm:size-20',
}: {
  icon: string
  hue: number
  className?: string
  iconClassName?: string
}) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 20% 15%, hsl(${hue} 90% 88% / .9) 0%, hsl(${(hue + 40) % 360} 80% 78% / .55) 38%, hsl(${(hue + 90) % 360} 75% 62% / .45) 100%)`,
      }}
    >
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
    </div>
  )
}
