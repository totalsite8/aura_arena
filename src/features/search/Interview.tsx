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
    <div>
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-mute">
        Вопрос {step + 1} из {questions.length}
      </p>
      <h2 className="font-display mt-1 text-[28px] leading-tight">{q.title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {q.options.map((o, i) => (
          <motion.button
            key={o.id}
            type="button"
            onClick={() => onPick(q.id, o.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: i * 0.05 }}
            className="surface rounded-3xl p-4 text-left hover:border-accent"
          >
            <span className="text-[16px] font-semibold">{o.label}</span>
            {o.hint && <span className="mt-1 block text-[13px] text-mute">{o.hint}</span>}
            {hintId === o.id && (
              <span className="mt-2 inline-block rounded-full bg-bg2 px-2 py-0.5 text-[11px] font-semibold text-mute">
                из вашего запроса
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
