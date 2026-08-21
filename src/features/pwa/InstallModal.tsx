import { usePwaInstall } from "@/hooks/usePwaInstall";
import { Button, Modal } from "@/components/ui";
import { AuraParticles } from "@/components/aura/AuraParticles";

export function InstallModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { canPrompt, installed, isIos, isMobile, promptInstall } = usePwaInstall();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <AuraParticles className="h-[140px] w-full max-w-[280px]" />
        <h2 className="font-display mt-2 text-[26px]">Aura всегда под рукой</h2>
        <p className="mt-1 max-w-[34ch] text-[14px] text-mute">
          {installed
            ? "Уже открыта как приложение. Можно просто пользоваться."
            : "Добавьте ярлык на экран — и поиск будет как любимая кнопка."}
        </p>
      </div>

      {!installed && (
        <div className="mt-4 space-y-3">
          {canPrompt && (
            <Button
              className="w-full"
              onClick={() => {
                void promptInstall();
              }}
            >
              Добавить на экран
            </Button>
          )}

          {isIos && (
            <ol className="space-y-2 rounded-2xl bg-bg2 p-4 text-left text-[13px] text-ink">
              <li>1. Нажмите «Поделиться» в Safari.</li>
              <li>2. Выберите «На экран „Домой“».</li>
              <li>3. Подтвердите «Добавить».</li>
            </ol>
          )}

          {!canPrompt && !isIos && isMobile && (
            <p className="rounded-2xl bg-bg2 p-4 text-left text-[13px] text-mute">
              В меню браузера выберите «Добавить на главный экран» — так Aura откроется как обычное приложение.
            </p>
          )}

          {!canPrompt && !isMobile && (
            <div className="rounded-2xl bg-bg2 p-4 text-left text-[13px] text-mute">
              <p className="font-semibold text-ink">На компьютере</p>
              <p className="mt-1">
                В Chrome или Edge откройте меню браузера и выберите «Установить Aura». Если пункта нет — закрепите вкладку
                или добавьте страницу в закладки панели.
              </p>
            </div>
          )}
        </div>
      )}

      <Button variant="soft" className="mt-4 w-full" onClick={onClose}>
        Понятно
      </Button>
    </Modal>
  );
}
