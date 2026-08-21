import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/features/search/SearchBar";
import { Interview } from "@/features/search/Interview";
import { ProcessPanel } from "@/features/search/ProcessPanel";
import { ProductResults } from "@/features/product/ProductResults";
import { GiftResults } from "@/features/gift/GiftResults";
import { ServiceResults } from "@/features/service/ServiceResults";
import { classify } from "@/lib/classify";
import { interviewFor, guessGiftWho } from "@/data/interviews";
import { stepsFor, doneAt } from "@/data/process";
import { resolveDemo, type DemoPayload } from "@/data/resolve";
import { timelineScale } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAuraStore } from "@/store/useAuraStore";
import type { IntentType, InterviewAnswers } from "@/types";
import { Chip } from "@/components/ui";

type Phase = "interview" | "running" | "results";

function remapClarify(id: string): IntentType {
  if (id === "exact") return "exact_product";
  if (id === "gift") return "gift_search";
  if (id === "service") return "service_search";
  return "category_search";
}

export function SearchFlow() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const fast = params.get("fast") === "1";
  const reduced = useReducedMotion();
  const city = useAuraStore((s) => s.city);

  const classified0 = useMemo(() => classify(q), [q]);
  const [type, setType] = useState<IntentType>(classified0.type);
  const [answers, setAnswers] = useState<InterviewAnswers>({});
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>(classified0.type === "exact_product" ? "running" : "interview");
  const [activeIndex, setActiveIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [payload, setPayload] = useState<DemoPayload | null>(null);
  const timers = useRef<number[]>([]);

  const questions = useMemo(() => {
    if (type === "exact_product") return [];
    if (type === "unknown") return interviewFor("unknown", q);
    if (type === "category_search") return interviewFor("category_search", q);
    if (type === "gift_search") return interviewFor("gift_search", q);
    return interviewFor("service_search", q);
  }, [type, q]);

  const steps = useMemo(() => stepsFor(type === "unknown" ? "category_search" : type), [type]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const startRun = (nextType: IntentType, nextAnswers: InterviewAnswers) => {
    clearTimers();
    setPhase("running");
    setCollapsed(false);
    setActiveIndex(0);
    setPayload(null);
    const scale = timelineScale(fast, reduced);
    const runSteps = stepsFor(nextType === "unknown" ? "category_search" : nextType);
    runSteps.forEach((s, i) => {
      const id = window.setTimeout(() => setActiveIndex(i), s.delay * scale);
      timers.current.push(id);
    });
    const id = window.setTimeout(() => {
      const classified = { ...classified0, type: nextType === "unknown" ? "category_search" : nextType };
      setPayload(resolveDemo(classified, nextAnswers, city));
      setPhase("results");
      setCollapsed(true);
      setActiveIndex(runSteps.length - 1);
    }, doneAt(runSteps) * scale);
    timers.current.push(id);
  };

  useEffect(() => {
    const c = classify(q);
    setType(c.type);
    setAnswers({});
    setStep(0);
    setPayload(null);
    if (!q.trim()) {
      setPhase("interview");
      return clearTimers;
    }
    if (c.type === "exact_product") startRun("exact_product", {});
    else {
      clearTimers();
      setPhase("interview");
      setActiveIndex(0);
      setCollapsed(false);
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const onPick = (questionId: string, optionId: string) => {
    if (type === "unknown" && questionId === "kind") {
      const next = remapClarify(optionId);
      setType(next);
      setAnswers({});
      setStep(0);
      if (next === "exact_product") startRun("exact_product", {});
      return;
    }
    const nextAnswers = { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);
    if (step + 1 >= questions.length) startRun(type, nextAnswers);
    else setStep((s) => s + 1);
  };

  const hintId = type === "gift_search" && questions[step]?.id === "who" ? guessGiftWho(q) : undefined;

  const optionLabel = (qid: string, oid: string) => {
    const qq = questions.find((x) => x.id === qid) ?? interviewFor(
      type === "exact_product" || type === "unknown" ? "category_search" : type,
      q,
    ).find((x) => x.id === qid);
    return qq?.options.find((o) => o.id === oid)?.label ?? oid;
  };

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
      <div className="mx-auto max-w-[720px]">
        <SearchBar
          key={q}
          size="sm"
          initial={q}
          onSubmit={(next) => {
            setParams({ q: next, ...(fast ? { fast: "1" } : {}) });
          }}
        />
      </div>

      {!q.trim() && (
        <p className="mt-10 text-center text-mute">Напишите, что нужно найти.</p>
      )}

      {q.trim() && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,280px)_1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <ProcessPanel
              steps={steps}
              activeIndex={activeIndex}
              collapsed={collapsed}
              onToggle={() => setCollapsed((v) => !v)}
            />
            {Object.keys(answers).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(answers).map(([k, v]) => (
                  <Chip key={k}>{optionLabel(k, v)}</Chip>
                ))}
              </div>
            )}
          </div>

          <div>
            {phase === "interview" && (
              <Interview questions={questions} step={step} onPick={onPick} hintId={hintId} />
            )}
            {phase === "running" && (
              <div className="surface rounded-3xl p-6">
                <p className="font-display text-[28px]">Aura думает</p>
                <p className="mt-2 text-[14px] text-mute">
                  Ищу, сравниваю и проверяю. Результат появится через несколько секунд.
                </p>
              </div>
            )}
            {phase === "results" && payload?.kind === "product" && (
              <ProductResults headline={payload.headline} chips={payload.chips} products={payload.products} />
            )}
            {phase === "results" && payload?.kind === "gift" && (
              <GiftResults headline={payload.headline} chips={payload.chips} directions={payload.directions} />
            )}
            {phase === "results" && payload?.kind === "service" && (
              <ServiceResults
                headline={payload.headline}
                chips={payload.chips}
                brief={payload.brief}
                offers={payload.offers}
                cautions={payload.cautions}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
