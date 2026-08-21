import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, CornerDownRight } from 'lucide-react'
import { useFlow } from '../stores/flow'

const SPRING = { type: 'spring', stiffness: 110, damping: 16 } as const

/** Уточняющие вопросы — кликабельные карточки вместо длинных форм */
export function QuestionFlow() {
  const questions = useFlow((s) => s.questions)
  const qIndex = useFlow((s) => s.qIndex)
  const answers = useFlow((s) => s.answers)
  const answer = useFlow((s) => s.answer)
  const skipQuestions = useFlow((s) => s.skipQuestions)
  const query = useFlow((s) => s.query)

  const q = questions[qIndex]
  if (!q) return null

  const answered = Object.values(answers)

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className="glass-card mx-auto w-full max-w-xl rounded-[28px] p-6 sm:p-8"
      aria-label="Уточняющие вопросы"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-faint">
          Вопрос {qIndex + 1} из {questions.length}
        </p>
        <div className="flex gap-1.5">
          {questions.map((question, i) => (
            <span
              key={question.id}
              className={`h-1.5 rounded-full transition-all ${
                i < qIndex ? 'w-5 bg-good' : i === qIndex ? 'w-7 bg-accent' : 'w-5 bg-line'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 text-[13px] text-muted">
        По запросу «{query}» — уточню пару деталей, чтобы подобрать точнее:
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={SPRING}
        >
          <h2 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">{q.title}</h2>

          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {q.options.map((opt, i) => (
              <motion.button
                key={opt}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.05 * i }}
                whileTap={{ scale: 0.97 }}
                onClick={() => answer(q.id, opt)}
                className={`group flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3.5 text-left text-sm font-semibold transition-all hover:border-accent hover:shadow-[var(--glow-accent)] ${
                  q.options.length % 2 === 1 && i === q.options.length - 1 ? 'sm:col-span-2' : ''
                }`}
              >
                {opt}
                <Check className="size-4 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={3} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between gap-3">
        {answered.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {answered.map((a) => (
              <span key={a} className="chip">
                {a}
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={skipQuestions}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-accent"
        >
          <CornerDownRight className="size-3.5" />
          Пропустить вопросы
        </button>
      </div>

      {qIndex > 0 && (
        <p className="mt-3 hidden items-center gap-1 text-[11px] text-faint sm:flex">
          <ArrowLeft className="size-3" /> Ответы выше уже учтены
        </p>
      )}
    </motion.section>
  )
}
