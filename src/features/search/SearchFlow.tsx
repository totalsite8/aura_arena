import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Interview } from "@/features/search/Interview";
import { ProcessTheater, usePageCounter } from "@/features/search/ProcessTheater";
import { JourneyStrip } from "@/features/search/JourneyStrip";
import { ProductResults } from "@/features/product/ProductResults";
import { GiftResults } from "@/features/gift/GiftResults";
import { ServiceResults } from "@/features/service/ServiceResults";
import { classify } from "@/lib/classify";
import { interviewFor, guessGiftWho } from "@/data/interviews";
import { stepsFor, doneAt } from "@/data/process";
import { resolveDemo, type DemoPayload } from "@/data/resolve";
import { springSoft, timelineScale } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAuraStore } from "@/store/useAuraStore";
import type { IntentType, InterviewAnswers } from "@/types";
import { Chip } from "@/components/ui";

type Phase = "interview" | "running" | "folding" | "results";

function remapClarify(id: string): IntentType {
  if (id === "exact") return "exact_product";
  if (id === "gift") return "gift_search";
  if (id === "service") return "service_search";
  return "category_search";
}

export function SearchFlow() {
  const [params] = useSearchParams();
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
  const [payload, setPayload] = useState<DemoPayload | null>(null);
  const timers = useRef<number[]>([]);
  const live = phase === "running" || phase === "folding" || phase === "results";
  const pages = usePageCounter(live, fast);

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
    setActiveIndex(0);
    setPayload(null);
    const scale = timelineScale(fast, reduced);
    const runSteps = stepsFor(nextType === "unknown" ? "category_search" : nextType);
    runSteps.forEach((s, i) => {
      timers.current.push(window.setTimeout(() => setActiveIndex(i), s.delay * scale));
    });
    const classified = { ...classified0, type: nextType === "unknown" ? "category_search" : nextType };
    const data = resolveDemo(classified, nextAnswers, city);
    timers.current.push(
      window.setTimeout(() => {
        setPayload(data);
        setPhase("folding");
        setActiveIndex(runSteps.length - 1);
        timers.current.push(
          window.setTimeout(() => setPhase("results"), reduced ? 80 : fast ? 220 : 780),
        );
      }, doneAt(runSteps) * scale),
    );
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
    const qq =
      questions.find((x) => x.id === qid) ??
      interviewFor(type === "exact_product" || type === "unknown" ? "category_search" : type, q).find((x) => x.id === qid);
    return qq?.options.find((o) => o.id === oid)?.label ?? oid;
  };

  return (
    <div className="mx-auto w-full max-w-[1440px]">
      {!q.trim() && (
        <div className="px-4 py-24 text-center">
          <p className="font-display text-[40px] leading-none">Напишите, что нужно</p>
          <p className="mt-3 text-[14px] text-mute">Строка сверху всегда под рукой. Клавиша /</p>
        </div>
      )}

      {q.trim() && (
        <div className="flex flex-col gap-3">
          {Object.keys(answers).length > 0 && phase === "interview" && (
            <div className="flex flex-wrap gap-2 px-3">
              {Object.entries(answers).map(([k, v]) => (
                <Chip key={k}>{optionLabel(k, v)}</Chip>
              ))}
            </div>
          )}

          {phase === "interview" && (
            <div className="px-3">
              <Interview questions={questions} step={step} onPick={onPick} hintId={hintId} />
            </div>
          )}

          <AnimatePresence mode="wait">
            {(phase === "running" || phase === "folding") && (
              <ProcessTheater
                query={q}
                type={type}
                steps={steps}
                activeIndex={activeIndex}
                fast={fast}
                pages={pages}
                folding={phase === "folding"}
              />
            )}
          </AnimatePresence>

          {phase === "results" && payload && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={springSoft} className="flex flex-col gap-3 px-3">
              <JourneyStrip steps={steps} pages={pages} query={q} />
              {payload.kind === "product" && (
                <ProductResults headline={payload.headline} chips={payload.chips} products={payload.products} />
              )}
              {payload.kind === "gift" && (
                <GiftResults headline={payload.headline} chips={payload.chips} directions={payload.directions} />
              )}
              {payload.kind === "service" && (
                <ServiceResults
                  headline={payload.headline}
                  chips={payload.chips}
                  brief={payload.brief}
                  offers={payload.offers}
                  cautions={payload.cautions}
                />
              )}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
