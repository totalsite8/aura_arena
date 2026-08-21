import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { useAuraStore } from "@/store/useAuraStore";
import { formatPoints } from "@/lib/format";

export function WalletPage() {
  const points = useAuraStore((s) => s.points);
  const txs = useAuraStore((s) => s.transactions);
  const addPoints = useAuraStore((s) => s.addPoints);

  const share = async () => {
    const url = `${window.location.origin}/?ref=demo`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Ссылка скопирована");
    } catch {
      toast(url);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[640px] space-y-5 px-4 py-8">
      <h1 className="font-display text-[36px]">Баллы Aura</h1>
      <div className="surface rounded-[28px] p-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mute">Сейчас у вас</p>
        <p className="mt-2 font-display text-[48px] leading-none">{formatPoints(points)}</p>
        <p className="mt-4 text-[14px] text-mute">
          В связи с большим количеством пользователей мы ввели систему баллов. Они бесплатны.
        </p>
        <p className="mt-2 text-[13px] text-mute">10 баллов = 1₽ выгоды при покупке. Поиск при этом остаётся бесплатным.</p>
      </div>

      <div className="surface rounded-[28px] p-6">
        <h2 className="text-[18px] font-bold">Порекомендуй другу — получи 1000 баллов</h2>
        <p className="mt-2 text-[14px] text-mute">Если поиск зашёл — поделитесь ссылкой. В демо начисление тоже условное.</p>
        <Button className="mt-4" onClick={() => void share()}>
          Поделиться
        </Button>
        <Button
          variant="soft"
          className="mt-2"
          onClick={() => {
            addPoints(1000, "Рекомендация другу (демо)");
            toast("В демо начислили 1000 баллов");
          }}
        >
          Начислить демо-бонус
        </Button>
      </div>

      <div className="surface rounded-[28px] p-6">
        <h2 className="text-[16px] font-bold">История</h2>
        <ul className="mt-3 space-y-2">
          {txs.map((t) => (
            <li key={t.id} className="flex items-center justify-between text-[14px]">
              <span>
                <span className="block font-medium">{t.label}</span>
                <span className="text-[12px] text-mute">{t.at}</span>
              </span>
              <span className={t.delta >= 0 ? "font-semibold text-ok" : "font-semibold text-bad"}>
                {t.delta >= 0 ? "+" : ""}
                {formatPoints(t.delta)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[13px] text-mute">
        <Link to="/smart-link/demo" className="underline">
          Страница для компаний
        </Link>
        {" · "}
        <Link to="/terms" className="underline">
          Оферта
        </Link>
        {" · "}
        <Link to="/privacy" className="underline">
          Конфиденциальность
        </Link>
      </p>
    </div>
  );
}
