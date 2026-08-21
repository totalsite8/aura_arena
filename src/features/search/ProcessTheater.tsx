import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { makeSerp, searchUrl, SHOP_SOURCES, MAP_SOURCES, stepQuery } from "@/data/crawl";
import { springSoft } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { CrawlSource, IntentType, ProcessStep } from "@/types";

function useTyped(text: string, ms: number, key: string) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced || ms <= 0 ? text : "");
  useEffect(() => {
    if (reduced || ms <= 0) {
      setOut(text);
      return;
    }
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, ms);
    return () => window.clearInterval(id);
  }, [text, ms, key, reduced]);
  return out;
}

function ShopStream({
  source,
  query,
  fast,
  sceneKey,
}: {
  source: CrawlSource;
  query: string;
  fast: boolean;
  sceneKey: string;
}) {
  const url = searchUrl(source, query);
  const typed = useTyped(url.replace("https://", ""), fast ? 0 : 14, `${source.id}-${sceneKey}`);
  const rows = useMemo(() => makeSerp(query, source, "crawl"), [query, source]);
  const [n, setN] = useState(fast ? 6 : 1);
  const reduced = useReducedMotion();

  useEffect(() => {
    setN(fast || reduced ? 6 : 1);
    if (fast || reduced) return;
    const id = window.setInterval(() => setN((v) => Math.min(8, v + 1)), 160);
    return () => window.clearInterval(id);
  }, [sceneKey, fast, reduced]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springSoft}
      className="tile flex min-h-[280px] flex-col p-4 md:min-h-[340px]"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold">{source.name}</p>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: source.tint }} />
      </div>
      <p className="mt-2 truncate font-mono text-[11px] text-mute">
        {typed}
        <span className="ml-0.5 inline-block h-[11px] w-[6px] bg-gold align-middle" />
      </p>
      <ul className="mt-3 min-h-0 flex-1 space-y-2.5 overflow-hidden">
        {rows.slice(0, n).map((r) => (
          <li key={r.id} className="min-w-0">
            <p className="truncate text-[13px] font-medium leading-tight">{r.title}</p>
            <p className="truncate text-[11px] text-mute">{r.meta}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ParseScene({ query }: { query: string }) {
  const parts = query.split(/\s+/).filter(Boolean).slice(0, 8);
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex flex-wrap justify-center gap-2">
        {parts.map((p, i) => (
          <motion.span
            key={p + i}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...springSoft, delay: i * 0.08 }}
            className="rounded-full border border-line bg-card px-4 py-2 text-[18px] md:text-[22px]"
          >
            {p}
          </motion.span>
        ))}
      </div>
      <p className="mt-8 max-w-[36ch] text-center text-[14px] text-mute">Раскладываю запрос на части — чтобы искать точно, а не «примерно».</p>
    </div>
  );
}

function ReviewsScene({ query }: { query: string }) {
  const lines = [
    `${query}: что пишут в этом месяце`,
    "Свежий обзор — батарея и камера",
    "Люди жалуются на серый ввоз у слишком низкой цены",
    "Официальная витрина держит гарантию",
    "Видео: распаковка и первые дни",
    "Сравнение комплектаций 256 / 512",
  ];
  return (
    <div className="flex flex-1 flex-col justify-center gap-3 px-2">
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...springSoft, delay: i * 0.12 }}
          className="tile px-5 py-4 text-[16px] md:text-[18px]"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}

function CompareScene({ query }: { query: string }) {
  const shops = [
    { name: "Ozon", price: "дешевле", risk: true },
    { name: "Яндекс Маркет", price: "чуть выше", risk: false, pick: true },
    { name: "DNS", price: "рядом", risk: false },
    { name: "Wildberries", price: "ниже", risk: true },
    { name: "М.Видео", price: "выше", risk: false },
  ];
  return (
    <div className="flex flex-1 flex-col justify-center gap-2 px-2">
      <p className="mb-2 text-center text-[14px] text-mute">Складываю одно и то же предложение с разных витрин — {query}</p>
      {shops.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: i * 0.08 }}
          className={`tile flex items-center justify-between px-5 py-4 ${s.pick ? "ring-1 ring-gold" : ""}`}
        >
          <span className="font-semibold">{s.name}</span>
          <span className="text-[13px] text-mute">
            {s.price}
            {s.risk ? " · есть риск" : " · спокойнее"}
            {s.pick ? " · берём сюда" : ""}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function VerifyScene() {
  const checks = [
    "Магазин с живыми отзывами и сроком работы",
    "Гарантия указана прямо в карточке",
    "Мало жалоб на брак и некомплект",
    "Слишком низкая цена — часто серый ввоз, не беру её как главную",
    "Баллы Aura начислятся отдельно, цену не трогаю",
  ];
  return (
    <div className="mx-auto flex max-w-[640px] flex-1 flex-col justify-center gap-3 px-2">
      {checks.map((c, i) => (
        <motion.div
          key={c}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: i * 0.14 }}
          className="tile px-5 py-4 text-[16px]"
        >
          <span className="mr-2 text-ok">✓</span>
          {c}
        </motion.div>
      ))}
    </div>
  );
}

function ComposeScene() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springSoft}
        className="font-display text-[40px] leading-[0.9] md:text-[56px]"
      >
        Собираю вывод
      </motion.p>
      <p className="mt-4 max-w-[36ch] text-[15px] text-mute">Оставляю цену как есть. Если вариант дороже — так и скажу, за что платите.</p>
    </div>
  );
}

function InboxScene() {
  const notes = [
    { from: "Тёплые окна", text: "Можем замерить завтра. Ориентир 89 000₽ с монтажом." },
    { from: "Стеклоград", text: "64 000₽. В цене нет подъёма и откосов." },
    { from: "Балкон-Мастер", text: "94 000₽, гарантия 7 лет, вывоз мусора включён." },
  ];
  return (
    <div className="mx-auto flex max-w-[640px] flex-1 flex-col justify-center gap-3">
      {notes.map((n, i) => (
        <motion.div
          key={n.from}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: i * 0.12 }}
          className="tile px-5 py-4"
        >
          <p className="text-[12px] text-mute">{n.from}</p>
          <p className="mt-1 text-[15px]">{n.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function ProcessTheater({
  query,
  type,
  steps,
  activeIndex,
  fast,
  pages,
  folding,
}: {
  query: string;
  type: IntentType;
  steps: ProcessStep[];
  activeIndex: number;
  fast: boolean;
  pages: number;
  folding?: boolean;
}) {
  const step = steps[Math.min(Math.max(activeIndex, 0), steps.length - 1)];
  const scene = step?.scene ?? "crawl";
  const q = stepQuery(query, step?.queryHint ?? "");
  const sources = type === "service_search" ? MAP_SOURCES : SHOP_SOURCES;

  return (
    <motion.section
      layout
      animate={{ opacity: folding ? 0.35 : 1, scale: folding ? 0.96 : 1, y: folding ? 18 : 0 }}
      transition={springSoft}
      className="theater mx-auto flex w-full max-w-[1440px] flex-col px-3 pb-6"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium tracking-[0.16em] text-mute uppercase">Что я сейчас делаю</p>
          <h2 className="font-display mt-1 text-[34px] leading-[0.92] md:text-[52px]">{step?.text}</h2>
          <p className="mt-2 max-w-[52ch] text-[14px] text-mute">{step?.detail}</p>
        </div>
        <p className="font-mono text-[12px] text-mute">{pages.toLocaleString("ru-RU")} страниц</p>
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto">
        {steps.map((s, i) => (
          <span
            key={s.id}
            className={`h-1 min-w-[36px] flex-1 rounded-full ${
              i < activeIndex ? "bg-gold" : i === activeIndex ? "bg-ink" : "bg-line"
            }`}
          />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step?.id ?? "x"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={springSoft}
            className="flex min-h-[52vh] flex-1 flex-col"
          >
            {scene === "parse" && <ParseScene query={query} />}
            {scene === "reviews" && <ReviewsScene query={query} />}
            {(scene === "crawl" || scene === "send") && (
              <div className={`grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2 ${sources.length > 4 ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
                {sources.map((src) => (
                  <ShopStream key={src.id} source={src} query={q} fast={fast} sceneKey={step?.id ?? "c"} />
                ))}
              </div>
            )}
            {scene === "compare" && <CompareScene query={query} />}
            {scene === "verify" && <VerifyScene />}
            {scene === "compose" && <ComposeScene />}
            {scene === "inbox" && <InboxScene />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export function usePageCounter(running: boolean, fast: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!running) return;
    setN(fast ? 40 : 3);
    const id = window.setInterval(() => setN((v) => v + (fast ? 9 : 1 + Math.floor(Math.random() * 2))), fast ? 70 : 140);
    return () => window.clearInterval(id);
  }, [running, fast]);
  return n;
}
