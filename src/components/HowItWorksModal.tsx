import { Newspaper, Scale, ShieldCheck, Store } from 'lucide-react'
import { useUi } from '../stores/ui'
import { Modal } from './ui/primitives'

const ROLES = [
  {
    icon: Newspaper,
    title: 'Исследователи',
    text: 'Каждый день читают свежие обзоры, рейтинги и жалобы. Знают, что реально хорошо — прямо сейчас, а не год назад.',
  },
  {
    icon: Store,
    title: 'Поиск по магазинам',
    text: 'Одновременно проверяют десятки магазинов и предложений: цены, наличие, сроки доставки именно в ваш город.',
  },
  {
    icon: Scale,
    title: 'Аналитики',
    text: 'Сравнивают варианты по-честному: цена за характеристику, реальные отзывы, история цены, комплектации. Подозрительно дешёвое — сразу в сторону.',
  },
  {
    icon: ShieldCheck,
    title: 'Ревизоры',
    text: 'Последними перепроверяют лучший вариант: гарантия, происхождение товара, надёжность продавца. Только после этого появляется «Выбор Aura».',
  },
]

/** «Как мы это делаем» — честно и простыми словами */
export function HowItWorksModal() {
  const open = useUi((s) => s.howOpen)
  const setOpen = useUi((s) => s.setHowOpen)

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="За каждым поиском — целая команда" wide>
      <p className="text-sm text-muted">
        Мы не просто ищем по слову. За один ваш запрос работает несколько специалистов — одновременно и
        каждый по-своему:
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ROLES.map((r) => (
          <div key={r.title} className="rounded-3xl bg-card-2/50 p-4">
            <span className="grid size-10 place-items-center rounded-2xl bg-accent/12 text-accent">
              <r.icon className="size-5" />
            </span>
            <h3 className="mt-3 text-sm font-extrabold">{r.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{r.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-3xl border border-line bg-card-2/40 p-4 text-sm">
        <b>Почему нам можно доверять:</b> если лучший по цене и качеству вариант находится там, с чем мы совсем не
        связаны, — мы всё равно покажем его первым. Честный выбор важнее разовой выгоды.
      </p>
      <p className="mt-3 text-center text-xs text-faint">И да — сам поиск всегда бесплатный.</p>
    </Modal>
  )
}
