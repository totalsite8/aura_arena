import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuraBeing } from "@/components/aura/AuraBeing";
import { SearchBar } from "@/features/search/SearchBar";
import { InstallModal } from "@/features/pwa/InstallModal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { springSoft } from "@/lib/motion";

const HINTS = ["Honor Magic 7 Pro", "Подарок маме", "Остеклить балкон", "Наушники до 3 000₽"];

export function HomePage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [install, setInstall] = useState(false);
  const [listening, setListening] = useState(false);
  const [draft, setDraft] = useState("");
  const [hovered, setHovered] = useState(false);
  const [hint, setHint] = useState(0);

  const mx = useMotionValue(50);
  const my = useMotionValue(38);
  const sx = useSpring(mx, { stiffness: 40, damping: 22 });
  const sy = useSpring(my, { stiffness: 40, damping: 22 });
  const glow = useMotionTemplate`radial-gradient(640px 440px at ${sx}% ${sy}%, color-mix(in srgb, var(--gold) 24%, transparent), transparent 64%)`;

  useEffect(() => {
    const id = window.setInterval(() => setHint((n) => (n + 1) % HINTS.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  const whisper = listening
    ? draft
      ? "Уже думаю"
      : "Слушаю"
    : hovered
      ? "Оставлю ярлык на экране"
      : "Кликни на меня — буду рядом";

  return (
    <div
      className="relative flex min-h-[calc(100dvh-72px)] flex-col overflow-hidden"
      onPointerMove={(e) => {
        if (reduced) return;
        mx.set((e.clientX / window.innerWidth) * 100);
        my.set((e.clientY / window.innerHeight) * 100);
      }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      <div className="relative mx-auto flex w-full max-w-[720px] flex-1 flex-col items-center px-4 pb-28 pt-[11vh] md:pt-[13vh]">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={springSoft}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
          <AuraBeing
            size={232}
            listening={listening}
            thinking={draft.length > 1}
            onClick={() => setInstall(true)}
          />
        </motion.div>

        <div className="mt-3 h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={whisper}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
              className="text-center text-[13px] text-mute"
            >
              {whisper}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-[min(9vh,88px)] w-full"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.12 }}
        >
          <SearchBar
            autoFocus
            hero
            onListening={setListening}
            onDraft={setDraft}
            onSubmit={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)}
          />
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-[12px] font-semibold tracking-[0.18em] text-mute uppercase">Поиск бесплатный</p>
            <p className="h-5 text-[13px] text-mute">
              Например:{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={HINTS[hint]}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="inline-block text-ink"
                >
                  {HINTS[hint]}
                </motion.span>
              </AnimatePresence>
            </p>
          </div>
        </motion.div>
      </div>

      <InstallModal open={install} onClose={() => setInstall(false)} />
    </div>
  );
}
