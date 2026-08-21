import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button, Chip, Modal } from "@/components/ui";
import { formatPrice, formatRating } from "@/lib/format";
import { springSoft } from "@/lib/motion";
import type { ServiceBrief } from "@/data/services";
import type { ServiceOffer } from "@/types";

export function ServiceResults({
  headline,
  chips,
  brief,
  offers,
  cautions,
}: {
  headline: string;
  chips: string[];
  brief: ServiceBrief;
  offers: ServiceOffer[];
  cautions: string[];
}) {
  const [picked, setPicked] = useState<ServiceOffer | null>(null);
  const [contact, setContact] = useState(false);
  const rec = offers.find((o) => o.recommended);
  const rest = offers.filter((o) => !o.recommended);

  return (
    <div className="bento">
      <div className="tile col-span-12 px-5 py-4 md:col-span-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Результат</p>
        <h2 className="font-display mt-1 text-[28px] leading-[0.95] md:text-[34px]">{headline}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </div>
      <div className="tile col-span-12 px-5 py-4 md:col-span-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{brief.title}</p>
        <ul className="mt-3 space-y-1 text-[13px]">
          <li>Услуга: {brief.service}</li>
          <li>Срок: {brief.when}</li>
          <li>Бюджет: {brief.budget}</li>
          <li>Важно: {brief.important}</li>
          <li>Город: {brief.city}</li>
        </ul>
      </div>

      {rec && (
        <div className="tile col-span-12 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="accent-btn rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                Рекомендация Aura
              </span>
              <h3 className="font-display mt-3 text-[28px] leading-none">{rec.companyName}</h3>
              <p className="mt-2 flex items-center gap-1 text-[13px] text-mute">
                <Star size={14} />
                {formatRating(rec.rating)} · {rec.reviewsCount} · {rec.responseTime}
              </p>
            </div>
            <p className="font-display text-[32px] leading-none">{formatPrice(rec.estimatedPrice)}</p>
          </div>
          <p className="mt-3 text-[13px] text-mute">{rec.notes}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {rec.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <Button className="mt-4" onClick={() => setPicked(rec)}>
            Выбрать
          </Button>
        </div>
      )}

      {rest.map((o, i) => (
        <motion.article
          key={o.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: i * 0.05 }}
          className="tile col-span-12 p-4 sm:col-span-6"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[16px] font-semibold">{o.companyName}</h3>
            <p className="font-display text-[22px] leading-none">{formatPrice(o.estimatedPrice)}</p>
          </div>
          <p className="mt-1 text-[12px] text-mute">
            {formatRating(o.rating)} · {o.responseTime}
          </p>
          <p className="mt-2 text-[12px] text-mute">{o.notes}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {o.tags.map((t) => (
              <Chip key={t} className={t.includes("скрыт") ? "border-bad/30 text-bad" : ""}>
                {t}
              </Chip>
            ))}
          </div>
          <Button variant="ghost" className="mt-3" onClick={() => setPicked(o)}>
            Выбрать
          </Button>
        </motion.article>
      ))}

      <div className="tile col-span-12 p-5">
        <h3 className="text-[15px] font-semibold">На что обратить внимание</h3>
        <ul className="mt-2 columns-1 gap-8 text-[13px] text-mute sm:columns-2">
          {cautions.map((c) => (
            <li key={c} className="mb-1">
              — {c}
            </li>
          ))}
        </ul>
      </div>

      <Modal
        open={Boolean(picked)}
        onClose={() => {
          setPicked(null);
          setContact(false);
        }}
      >
        {picked && (
          <>
            <h3 className="pr-8 text-[18px] font-bold">Вы выбрали эту компанию</h3>
            <p className="mt-1 text-[15px] font-semibold">{picked.companyName}</p>
            <p className="mt-2 text-[14px] text-mute">
              Контакт откроется после подтверждения заявки. В демо ничего не отправляется.
            </p>
            {!contact ? (
              <Button className="mt-4 w-full" onClick={() => setContact(true)}>
                Открыть контакт
              </Button>
            ) : (
              <div className="mt-4 rounded-2xl bg-bg2 p-4 text-[14px]">
                <p className="font-semibold">В демо-режиме контакт открывается условно</p>
                <p className="mt-1">Телефон: +7 900 000-00-00</p>
              </div>
            )}
            <Button
              variant="soft"
              className="mt-3 w-full"
              onClick={() => {
                toast("Заявку в демо не отправляем");
                setPicked(null);
                setContact(false);
              }}
            >
              Закрыть
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}
