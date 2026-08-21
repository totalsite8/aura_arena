import { motion } from "framer-motion";
import type { InterviewQuestion } from "@/types";
import { springSoft } from "@/lib/motion";

export function Interview({
  questions,
  step,
  onPick,
  hintId,
}: {
  questions: InterviewQuestion[];
  step: number;
  onPick: (questionId: string, optionId: string) => void;
  hintId?: string;
}) {
  const q = questions[step];
  if (!q) return null;

  return (
    <div className="bento">
      <div className="tile col-span-12 px-5 py-5 md:col-span-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
          {step + 1} / {questions.length}
        </p>
        <h2 className="font-display mt-3 text-[32px] leading-[0.95]">{q.title}</h2>
        <p className="mt-3 text-[13px] text-mute">Короткий ответ — и я продолжаю обход витрин.</p>
      </div>
      {q.options.map((o, i) => (
        <motion.button
          key={o.id}
          type="button"
          onClick={() => onPick(q.id, o.id)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: i * 0.04 }}
          className="tile col-span-12 p-5 text-left hover:border-accent md:col-span-4"
        >
          <span className="font-display text-[22px] leading-none">{o.label}</span>
          {o.hint && <span className="mt-2 block text-[13px] text-mute">{o.hint}</span>}
          {hintId === o.id && (
            <span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
              из вашего запроса
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
