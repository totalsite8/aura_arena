import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuraParticles } from "@/components/aura/AuraParticles";
import { SearchBar } from "@/features/search/SearchBar";
import { InstallModal } from "@/features/pwa/InstallModal";
import { springSoft } from "@/lib/motion";

const HINTS = ["Honor Magic 7 Pro", "Подарок маме", "Остеклить балкон", "Наушники до 3 000₽"];

export function HomePage() {
  const navigate = useNavigate();
  const [install, setInstall] = useState(false);
  const [hint, setHint] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setHint((n) => (n + 1) % HINTS.length), 3400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-[calc(100dvh-72px)] flex-col">
      <AuraParticles className="min-h-[280px] w-full flex-1" onClick={() => setInstall(true)} />

      <motion.div
        className="mx-auto w-full max-w-[720px] px-4 pb-28 pt-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSoft}
      >
        <SearchBar autoFocus hero onSubmit={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
        <p className="mt-4 text-center text-[12px] font-semibold tracking-[0.18em] text-mute uppercase">
          Поиск бесплатный
        </p>
        <p className="mt-2 h-5 text-center text-[13px] text-mute">
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
      </motion.div>
      <InstallModal open={install} onClose={() => setInstall(false)} />
    </div>
  );
}
