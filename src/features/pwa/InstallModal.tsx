import { useState, type ReactNode } from 'react'
import { Check, MonitorSmartphone, Plus, Share } from 'lucide-react'
import { toast } from 'sonner'
import { useUi } from '../../stores/ui'
import { Modal, PrimaryButton } from '../../components/ui/primitives'
import { Orb } from '../../components/Orb'
import { usePwaInstall } from './usePwaInstall'

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-card-2/50 px-3.5 py-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-extrabold text-white">{n}</span>
      <span className="text-sm font-medium leading-snug">{children}</span>
    </li>
  )
}

export function InstallModal() {
  const open = useUi((s) => s.installOpen)
  const setOpen = useUi((s) => s.setInstallOpen)
  const { available, installed, isIos, isAndroid, promptInstall } = usePwaInstall()
  const [busy, setBusy] = useState(false)

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Добавить Aura на экран">
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <Orb size={64} withRing={false} />
          <p className="text-sm text-muted">
            Установите ярлык — и я всегда буду под рукой: один тап, и поиск уже работает.
            <span className="mt-1 block font-semibold text-ink">Без магазина приложений, занимает пару мегабайт.</span>
          </p>
        </div>

        {installed ? (
          <p className="flex items-center gap-2 rounded-2xl bg-good/10 px-4 py-3 text-sm font-bold text-good">
            <Check className="size-5" strokeWidth={2.6} />
            Aura уже у вас на экране — открывайте в любой момент
          </p>
        ) : available ? (
          <PrimaryButton
            className="w-full"
            onClick={async () => {
              setBusy(true)
              const res = await promptInstall()
              setBusy(false)
              if (res === 'installed') {
                toast.success('Готово!', { description: 'Ярлык Aura появится на главном экране.' })
                setOpen(false)
              }
            }}
          >
            {busy ? 'Открываю установку…' : 'Установить на экран'}
          </PrimaryButton>
        ) : isIos ? (
          <ol className="w-full space-y-2">
            <Step n={1}>
              Нажмите <Share className="inline size-4 text-accent" /> <b>«Поделиться»</b> внизу браузера
            </Step>
            <Step n={2}>
              Выберите <Plus className="inline size-4 text-accent" /> <b>«На экран "Домой"»</b>
            </Step>
            <Step n={3}>
              Нажмите <b>«Добавить»</b> — ярлык Aura появится рядом с приложениями
            </Step>
          </ol>
        ) : isAndroid ? (
          <ol className="w-full space-y-2">
            <Step n={1}>
              Откройте меню браузера <b>⋮</b> вверху справа
            </Step>
            <Step n={2}>
              Выберите <b>«Установить приложение»</b> или <b>«Добавить на главный экран»</b>
            </Step>
            <Step n={3}>Подтвердите — ярлык Aura появится на экране</Step>
          </ol>
        ) : (
          <ol className="w-full space-y-2">
            <Step n={1}>
              Найдите значок установки <MonitorSmartphone className="inline size-4 text-accent" /> в адресной строке
              браузера
            </Step>
            <Step n={2}>Нажмите его и подтвердите — Aura откроется как отдельное приложение</Step>
          </ol>
        )}

        {!installed && !available && (
          <p className="text-xs text-faint">Это демо: установка через браузерную кнопку PWA работает после публикации на домене.</p>
        )}
      </div>
    </Modal>
  )
}
