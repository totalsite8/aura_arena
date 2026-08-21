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
    <div className="relative flex min-h-[calc(100dvh-72px)] flex-col">
      <div className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col items-center px-3 pb-28 pt-2">
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AuraParticles className="h-[min(56vh,560px)] w-full" onClick={() => setInstall(true)} />
        </motion.div>

        <motion.div
          className="w-full max-w-[720px] -mt-2"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSoft, delay: 0.15 }}
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
      </div>
      <InstallModal open={install} onClose={() => setInstall(false)} />
    </div>
  );
}
