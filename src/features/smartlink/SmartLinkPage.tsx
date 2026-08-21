import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui";

const Price = z
  .string()
  .trim()
  .min(1, "Укажите цену")
  .regex(/^[\d\s]+$/, "Только цифры");

export function SmartLinkPage() {
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = () => {
    const parsed = Price.safeParse(price);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Проверьте поле");
      return;
    }
    setError(null);
    setSent(true);
  };

  return (
    <div className="mx-auto w-full max-w-[520px] px-4 py-10">
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mute">Без регистрации</p>
      <h1 className="font-display mt-2 text-[32px] leading-tight">Новый заказ в вашем районе</h1>
      <p className="mt-2 text-[14px] text-mute">Одно поле. Никакого кабинета. В демо ничего никуда не уходит.</p>

      <div className="surface mt-6 space-y-3 rounded-3xl p-5 text-[14px]">
        <p>
          <span className="text-mute">Услуга:</span> остекление балкона
        </p>
        <p>
          <span className="text-mute">Район:</span> Москва, север
        </p>
        <p>
          <span className="text-mute">Желаемый срок:</span> в течение месяца
        </p>
        <p>
          <span className="text-mute">Комментарий:</span> интересует тёплый профиль, нужен замер
        </p>
      </div>

      {sent ? (
        <div className="surface mt-6 rounded-3xl p-6 text-center">
          <p className="font-display text-[28px]">Цену приняли</p>
          <p className="mt-2 text-[14px] text-mute">В полной версии она уйдёт заказчику. Сейчас это только показ экрана.</p>
        </div>
      ) : (
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label className="block text-[13px] font-semibold">
            Ваша цена
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="numeric"
              placeholder="Например, 89000"
              className="surface mt-2 h-12 w-full rounded-2xl px-4 text-[16px] outline-none"
            />
          </label>
          {error && <p className="text-[13px] text-bad">{error}</p>}
          <Button className="w-full" onClick={submit}>
            Отправить цену
          </Button>
        </form>
      )}
    </div>
  );
}
