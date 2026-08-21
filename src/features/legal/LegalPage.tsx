import { Link } from "react-router-dom";

export function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const title = kind === "terms" ? "Оферта" : "Политика конфиденциальности";
  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-10">
      <h1 className="font-display text-[32px]">{title}</h1>
      <p className="mt-3 rounded-2xl bg-bg2 p-4 text-[13px] text-mute">
        Это демо-текст. В рабочей версии здесь будет юридический документ.
      </p>
      <div className="mt-5 space-y-3 text-[14px] text-mute">
        {kind === "terms" ? (
          <>
            <p>1. Aura — демонстрационный прототип. Цены, магазины, баллы и компании вымышлены.</p>
            <p>2. Баллы Aura не являются деньгами и не оплачивают поиск.</p>
            <p>3. Рекомендации не являются офертой магазина или компании.</p>
            <p>4. Эскроу нет. Реальной оплаты в демо нет.</p>
          </>
        ) : (
          <>
            <p>1. Прототип не отправляет данные на сервер: всё остаётся в вашем браузере.</p>
            <p>2. Тема и баллы сохраняются только на этом устройстве.</p>
            <p>3. В рабочей версии политика будет соответствовать 152-ФЗ.</p>
          </>
        )}
      </div>
      <Link to="/" className="mt-6 inline-block text-[14px] font-semibold text-accent">
        На главную
      </Link>
    </div>
  );
}
