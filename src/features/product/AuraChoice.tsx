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
  delay = 0,
}: {
  product: Product;
  cheaper?: Product;
  delay?: number;
}) {
  const [demo, setDemo] = useState(false);
  const extra = cheaper && cheaper.price < product.price ? product.price - cheaper.price : 0;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springSoft, delay }}
        className="tile h-full"
      >
        <div className="grid h-full md:grid-cols-[minmax(0,240px)_1fr]">
          <ProductVisual kind={product.kind} hue={product.hue} title={product.title} className="h-[200px] md:h-full" />
          <div className="flex flex-col p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="accent-btn rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                Выбор Aura
              </span>
              {product.reliable && (
                <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[11px] font-semibold">
                  <ShieldCheck size={12} /> Магазин надёжнее
                </span>
              )}
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">{product.brand}</p>
            <h2 className="font-display mt-1 text-[26px] leading-[0.95] md:text-[30px]">{product.title}</h2>
            <p className="mt-2 flex items-center gap-2 text-[12px] text-mute">
              <Star size={13} />
              {formatRating(product.rating)} · {product.reviewsCount} · {product.shop}
            </p>
            <p className="mt-4 font-display text-[34px] leading-none">{formatPrice(product.price)}</p>
            {extra > 0 && (
              <p className="mt-1 text-[12px] text-mute">
                На {formatPrice(extra)} дороже самого дешёвого. Цену не режем — оставляем как есть.
              </p>
            )}
            <div className="mt-4 rounded-2xl border border-line bg-bg2 p-3">
              <p className="text-[13px] font-semibold">Если купите здесь — получите {formatPoints(product.points)} баллов Aura</p>
              <p className="mt-1 text-[12px] text-mute">Баллы не вычитаются из цены. Это отдельный бонус.</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.features.map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </div>
            <ul className="mt-3 space-y-1 text-[12px] text-mute">
              {product.whySelected.slice(0, 4).map((w) => (
                <li key={w}>— {w}</li>
              ))}
            </ul>
            <Button className="mt-auto w-full" onClick={() => setDemo(true)}>
              Купить
            </Button>
          </div>
        </div>
      </motion.article>

      <Modal open={demo} onClose={() => setDemo(false)}>
        <h3 className="pr-8 text-[18px] font-bold">Демо-режим</h3>
        <p className="mt-2 text-[14px] text-mute">Здесь будет переход к покупке. Цена остаётся {formatPrice(product.price)}.</p>
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
      <ProductVisual kind={product.kind} hue={product.hue} title={product.title} className="h-32" />
      <div className="flex flex-1 flex-col p-3.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">{product.shop}</p>
        <h3 className="mt-1 text-[14px] font-semibold leading-snug">{product.title}</h3>
        <p className="mt-2 font-display text-[22px] leading-none">{formatPrice(product.price)}</p>
        <p className="mt-1 text-[11px] text-mute">
          {formatRating(product.rating)} · {product.reliable ? "надёжный магазин" : "проверьте продавца"}
        </p>
        <Button variant="ghost" className="mt-3 w-full" onClick={() => toast("Демо-режим: здесь будет переход к покупке")}>
          Смотреть
        </Button>
      </div>
    </motion.article>
  );
}
