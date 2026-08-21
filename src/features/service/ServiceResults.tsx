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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-[28px] leading-tight md:text-[34px]">{headline}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      </div>

      <div className="surface rounded-3xl p-5">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mute">{brief.title}</p>
        <ul className="mt-3 space-y-1 text-[14px]">
          <li>Услуга: {brief.service}</li>
          <li>Срок: {brief.when}</li>
          <li>Бюджет: {brief.budget}</li>
          <li>Важно: {brief.important}</li>
          <li>Город: {brief.city}</li>
        </ul>
      </div>

      <div className="space-y-3">
        {offers.map((o, i) => (
          <motion.article
            key={o.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: i * 0.08 }}
            className={`surface rounded-3xl p-4 ${o.recommended ? "aura-ring" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[17px] font-bold">{o.companyName}</h3>
                  {o.recommended && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-[#1c1915]">
                      Рекомендация Aura
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1 text-[13px] text-mute">
                  <Star size={14} className="text-gold" />
                  {formatRating(o.rating)} · {o.reviewsCount} отзывов · {o.responseTime}
                </p>
              </div>
              <p className="text-[20px] font-bold">{formatPrice(o.estimatedPrice)}</p>
            </div>
            <p className="mt-2 text-[13px] text-mute">{o.notes}</p>
            <p className="mt-1 text-[12px] text-mute">Срок гарантии: {o.warranty}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.tags.map((t) => (
                <Chip key={t} className={t.includes("скрыт") ? "border-bad/30 text-bad" : ""}>
                  {t}
                </Chip>
              ))}
            </div>
            <Button className="mt-4" variant={o.recommended ? "primary" : "ghost"} onClick={() => setPicked(o)}>
              Выбрать
            </Button>
          </motion.article>
        ))}
      </div>

      <div className="surface rounded-3xl p-5">
        <h3 className="text-[16px] font-bold">На что обратить внимание</h3>
        <ul className="mt-2 space-y-1 text-[14px] text-mute">
          {cautions.map((c) => (
            <li key={c}>— {c}</li>
          ))}
        </ul>
      </div>

      <Modal open={Boolean(picked)} onClose={() => { setPicked(null); setContact(false); }}>
        {picked && (
          <>
            <h3 className="pr-8 text-[18px] font-bold">Вы выбрали эту компанию</h3>
            <p className="mt-1 text-[15px] font-semibold">{picked.companyName}</p>
            <p className="mt-2 text-[14px] text-mute">
              Контакт откроется после подтверждения заявки. В демо ничего не отправляется и не оплачивается.
            </p>
            {!contact ? (
              <Button className="mt-4 w-full" onClick={() => setContact(true)}>
                Открыть контакт
              </Button>
            ) : (
              <div className="mt-4 rounded-2xl bg-bg2 p-4 text-[14px]">
                <p className="font-semibold">В демо-режиме контакт открывается условно</p>
                <p className="mt-1">Телефон: +7 900 000-00-00</p>
                <p>Почта: hello@example.ru</p>
              </div>
            )}
            <Button
              variant="soft"
              className="mt-3 w-full"
              onClick={() => {
                toast("Заявку в демо не отправляем — это только показ экрана");
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
