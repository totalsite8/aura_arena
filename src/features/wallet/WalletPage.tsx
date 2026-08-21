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
    <div className="mx-auto w-full max-w-[880px] px-3">
      <div className="bento">
        <div className="tile col-span-12 p-6 md:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Баллы Aura</p>
          <p className="font-display mt-3 text-[64px] leading-none">{formatPoints(points)}</p>
          <p className="mt-4 max-w-[46ch] text-[14px] text-mute">
            В связи с большим количеством пользователей мы ввели систему баллов. Они бесплатны.
          </p>
          <p className="mt-2 max-w-[46ch] text-[13px] text-mute">
            Баллы не вычитаются из цены товара. Если купите выбранный вариант — получите их сверху.
          </p>
        </div>
        <div className="tile col-span-12 p-6 md:col-span-5">
          <h2 className="font-display text-[26px] leading-[0.95]">Порекомендуй другу — получи 1000 баллов</h2>
          <p className="mt-3 text-[13px] text-mute">Если поиск зашёл — поделитесь ссылкой.</p>
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
        <div className="tile col-span-12 p-6">
          <h2 className="text-[14px] font-semibold">История</h2>
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
      </div>
      <p className="mt-6 text-[12px] text-mute">
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
