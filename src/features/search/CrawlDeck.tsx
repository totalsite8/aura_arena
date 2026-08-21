import { useEffect, useMemo, useState } from "react";
import { makeSerp, searchUrl, sourcesFor, stepQuery } from "@/data/crawl";
import type { CrawlSource, IntentType, ProcessStep, SerpRow } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function useTyped(text: string, speed: number, resetKey: string) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : "");
  useEffect(() => {
    if (reduced || speed <= 0) {
      setOut(text);
      return;
    }
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, resetKey, reduced]);
  return out;
}

function BrowserPane({
  source,
  query,
  sceneKey,
  fast,
  compact,
}: {
  source: CrawlSource;
  query: string;
  sceneKey: string;
  fast: boolean;
  compact?: boolean;
}) {
  const url = searchUrl(source, query);
  const typed = useTyped(url, fast ? 0 : 12, `${source.id}:${sceneKey}:${query}`);
  const rows = useMemo(() => makeSerp(query, source, "crawl"), [query, source]);
  const [shown, setShown] = useState(2);
  const reduced = useReducedMotion();

  useEffect(() => {
    setShown(fast || reduced ? rows.length : 2);
    if (fast || reduced) return;
    const id = window.setInterval(() => {
      setShown((n) => Math.min(rows.length, n + 1));
    }, 90);
    return () => window.clearInterval(id);
  }, [rows, fast, reduced, sceneKey]);

  return (
    <div className="tile scanlines flex min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-line px-3 py-2" style={{ background: "var(--chrome)" }}>
        <span className="flex gap-1">
          <i className="block h-2 w-2 rounded-full bg-[#ff5f57]" />
          <i className="block h-2 w-2 rounded-full bg-[#febc2e]" />
          <i className="block h-2 w-2 rounded-full bg-[#28c840]" />
        </span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-mute">{source.name}</span>
        <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: source.tint }} />
      </div>
      <div className="border-b border-line px-2 py-1.5" style={{ background: "var(--url)" }}>
        <p className="font-mono truncate text-[10px] text-mute">
          {typed}
          <span className="ml-0.5 inline-block h-3 w-[7px] translate-y-[2px] bg-accent" />
        </p>
      </div>
      <ul className={`min-h-0 flex-1 space-y-2 overflow-hidden px-3 py-2 ${compact ? "max-h-[140px]" : "max-h-[220px]"}`}>
        {rows.slice(0, shown).map((r) => (
          <SerpItem key={r.id} row={r} tint={source.tint} />
        ))}
      </ul>
    </div>
  );
}

function SerpItem({ row, tint }: { row: SerpRow; tint: string }) {
  return (
    <li className="min-w-0">
      <p className="truncate text-[12px] font-semibold leading-tight">{row.title}</p>
      <p className="font-mono truncate text-[10px]" style={{ color: tint }}>
        {row.url.replace("https://", "")}
      </p>
      <p className="truncate text-[10px] text-mute">{row.meta ?? row.snippet}</p>
    </li>
  );
}

export function CrawlDeck({
  query,
  type,
  steps,
  activeIndex,
  fast,
  compact = false,
  pages,
}: {
  query: string;
  type: IntentType;
  steps: ProcessStep[];
  activeIndex: number;
  fast: boolean;
  compact?: boolean;
  pages: number;
}) {
  const step = steps[Math.min(Math.max(activeIndex, 0), steps.length - 1)];
  const scene = step?.scene ?? "crawl";
  const q = stepQuery(query, step?.queryHint ?? "");
  const sources = sourcesFor(type === "unknown" ? "category_search" : type, scene);
  const visible = compact ? sources.slice(0, 2) : sources.slice(0, 4);

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="tile flex flex-wrap items-center gap-2 px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">Что я сейчас делаю</span>
        <span className="text-[13px] font-semibold">{step?.text ?? "Aura думает"}</span>
        <span className="ml-auto font-mono text-[11px] text-mute">{pages.toLocaleString("ru-RU")} страниц</span>
      </div>

      {!compact && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {steps.map((s, i) => (
            <span
              key={s.id}
              className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${
                i === activeIndex ? "accent-btn" : i < activeIndex ? "bg-bg2 text-ink" : "text-mute"
              }`}
            >
              {s.text}
            </span>
          ))}
        </div>
      )}

      <p className="px-1 text-[12px] text-mute">{step?.detail}</p>

      <div className={`grid min-h-0 gap-2 ${compact ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"}`}>
        {visible.map((src) => (
          <BrowserPane
            key={`${src.id}-${step?.id ?? "x"}`}
            source={src}
            query={q}
            sceneKey={step?.id ?? "x"}
            fast={fast}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

export function usePageCounter(running: boolean, fast: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!running) return;
    setN(fast ? 86 : 4);
    const id = window.setInterval(() => {
      setN((v) => v + (fast ? 12 : 1 + Math.floor(Math.random() * 3)));
    }, fast ? 80 : 120);
    return () => window.clearInterval(id);
  }, [running, fast]);
  return n;
}
