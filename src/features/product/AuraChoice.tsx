import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { Button, Chip, Modal } from "@/components/ui";
import { ProductVisual } from "@/features/product/ProductVisual";
import { formatPoints, formatPrice, formatRating } from "@/lib/format";
import { springSoft } from "@/lib/motion";
import type { Product } from "@/types";

export function AuraChoice({
  product,
  cheaper,
}: {
  product: Product;
  cheaper?: Product;
}) {
  const [demo, setDemo] = useState(false);
  const extra = cheaper && cheaper.price < product.price ? product.price - cheaper.price : 0;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={springSoft}
        className="tile"
      >
        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr]">
          <ProductVisual kind={product.kind} hue={product.hue} title={product.title} className="h-[240px] lg:min-h-[420px]" />
          <div className="flex flex-col p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="accent-btn rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
                Выбор Aura
              </span>
              {product.reliable && (
                <span className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[12px] font-semibold">
                  <ShieldCheck size={13} /> Магазин надёжнее
                </span>
              )}
            </div>
            <p className="mt-5 text-[12px] tracking-[0.16em] text-mute uppercase">{product.brand}</p>
            <h2 className="font-display mt-2 text-[34px] leading-[0.92] md:text-[44px]">{product.title}</h2>
            <p className="mt-3 flex items-center gap-2 text-[13px] text-mute">
              <Star size={14} />
              {formatRating(product.rating)} · {product.reviewsCount} отзывов · {product.shop}
            </p>
            <p className="mt-6 font-display text-[44px] leading-none md:text-[52px]">{formatPrice(product.price)}</p>
            {extra > 0 && (
              <p className="mt-2 max-w-[46ch] text-[14px] text-mute">
                На {formatPrice(extra)} дороже самого дешёвого. Так и оставляю: спокойнее магазин важнее минуса на ценнике.
              </p>
            )}
            <p className="mt-4 text-[15px] font-semibold">
              Если купите здесь — получите {formatPoints(product.points)} баллов Aura
            </p>
            <p className="mt-1 text-[13px] text-mute">Баллы не вычитаются из цены. Это отдельный бонус.</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.features.map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </div>
            <div className="mt-5">
              <p className="text-[13px] font-semibold">Почему мы это выбрали</p>
              <ul className="mt-2 space-y-1 text-[14px] text-mute">
                {product.whySelected.slice(0, 4).map((w) => (
                  <li key={w}>— {w}</li>
                ))}
              </ul>
            </div>
            <Button className="mt-6 w-full max-w-sm py-3" onClick={() => setDemo(true)}>
              Купить
            </Button>
          </div>
        </div>
      </motion.article>

      <Modal open={demo} onClose={() => setDemo(false)}>
        <h3 className="pr-8 text-[18px] font-bold">Демо-режим</h3>
        <p className="mt-2 text-[14px] text-mute">Здесь откроется покупка. Цена останется {formatPrice(product.price)}.</p>
        <Button
          className="mt-4 w-full"
          onClick={() => {
            setDemo(false);
            toast("В полной версии откроется покупка");
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSoft, delay }}
      className="tile flex h-full flex-col"
    >
      <ProductVisual kind={product.kind} hue={product.hue} title={product.title} className="h-36" />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] tracking-[0.14em] text-mute uppercase">{product.shop}</p>
        <h3 className="mt-1 text-[15px] font-semibold leading-snug">{product.title}</h3>
        <p className="mt-2 font-display text-[24px] leading-none">{formatPrice(product.price)}</p>
        <p className="mt-1 text-[12px] text-mute">
          {formatRating(product.rating)} · {product.reliable ? "надёжный магазин" : "проверьте продавца"}
        </p>
        <Button variant="ghost" className="mt-4 w-full" onClick={() => toast("Демо-режим: здесь будет переход к покупке")}>
          Смотреть
        </Button>
      </div>
    </motion.article>
  );
}
