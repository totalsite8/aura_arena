import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button, Chip, Modal } from "@/components/ui";
import { ProductVisual } from "@/features/product/ProductVisual";
import { formatPoints, formatPrice, formatRating, pointsToRub } from "@/lib/format";
import { springSoft } from "@/lib/motion";
import type { Product } from "@/types";

export function AuraChoice({ product, delay = 0 }: { product: Product; delay?: number }) {
  const [why, setWhy] = useState(true);
  const [demo, setDemo] = useState<"points" | "plain" | null>(null);
  const save = pointsToRub(product.points);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...springSoft, delay }}
        className="surface aura-ring overflow-hidden rounded-[28px]"
      >
        <div className="grid md:grid-cols-[minmax(0,280px)_1fr]">
          <ProductVisual kind={product.kind} hue={product.hue} title={product.title} className="h-[240px] md:h-full" />
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#1c1915]">
                Выбор Aura
              </span>
              <Chip className="border-gold/40 bg-gold/15">+{formatPoints(product.points)} баллов</Chip>
            </div>
            <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-mute">{product.brand}</p>
            <h2 className="mt-1 text-[22px] font-bold leading-tight md:text-[26px]">{product.title}</h2>
            <p className="mt-2 flex items-center gap-2 text-[13px] text-mute">
              <Star size={14} className="text-gold" />
              {formatRating(product.rating)} · {product.reviewsCount} отзывов · {product.shop}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.features.map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-bg2 p-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mute">Честный расчёт</p>
              <div className="mt-2 space-y-1 text-[14px]">
                <div className="flex justify-between">
                  <span>Цена</span>
                  <span className="font-semibold">{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between text-ok">
                  <span>Баллы Aura</span>
                  <span>−{formatPrice(save)}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-[16px] font-bold">
                  <span>Твоя реальная цена</span>
                  <span>{formatPrice(product.price - save)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWhy((v) => !v)}
              className="mt-4 text-left text-[14px] font-semibold text-accent"
            >
              Почему мы это выбрали
            </button>
            {why && (
              <ul className="mt-2 space-y-1 text-[13px] text-mute">
                {product.whySelected.map((w) => (
                  <li key={w}>— {w}</li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" onClick={() => setDemo("points")}>
                Купить с баллами
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setDemo("plain")}>
                Купить без баллов
              </Button>
            </div>
          </div>
        </div>
      </motion.article>

      <Modal open={demo !== null} onClose={() => setDemo(null)}>
        <h3 className="pr-8 text-[18px] font-bold">Демо-режим</h3>
        <p className="mt-2 text-[14px] text-mute">
          Здесь будет переход к покупке. Сейчас ничего не списывается и никуда не уходит.
        </p>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            setDemo(null);
            toast("Сохранили это место — в полной версии откроется покупка");
          }}
        >
          Понятно
        </Button>
      </Modal>
    </>
  );
}

export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSoft, delay }}
      className="surface flex flex-col overflow-hidden rounded-3xl"
    >
      <ProductVisual kind={product.kind} hue={product.hue} title={product.title} className="h-40" />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mute">{product.brand}</p>
        <h3 className="mt-1 text-[15px] font-bold leading-snug">{product.title}</h3>
        <p className="mt-1 text-[13px] text-mute">
          {formatRating(product.rating)} · {product.shop}
        </p>
        <p className="mt-2 text-[18px] font-bold">{formatPrice(product.price)}</p>
        <p className="mt-1 line-clamp-2 text-[12px] text-mute">{product.features.slice(0, 3).join(" · ")}</p>
        <Button
          variant="ghost"
          className="mt-4 w-full"
          onClick={() => toast("Демо-режим: здесь будет переход к покупке")}
        >
          Купить
        </Button>
      </div>
    </motion.article>
  );
}
