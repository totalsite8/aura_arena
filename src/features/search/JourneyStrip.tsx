import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ProcessStep } from "@/types";
import { springSoft } from "@/lib/motion";

export function JourneyStrip({
  steps,
  pages,
  query,
}: {
  steps: ProcessStep[];
  pages: number;
  query: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const current = steps.find((s) => s.id === open);

  return (
    <motion.div layout transition={springSoft} className="tile px-4 py-3 md:px-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[12px] font-medium text-mute">Как я искала</p>
          <p className="text-[15px] font-semibold">
            {query} · {steps.length} шагов · {pages.toLocaleString("ru-RU")} страниц
          </p>
        </div>
        <p className="text-[12px] text-mute">нажмите шаг — увидите, что было</p>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setOpen((v) => (v === s.id ? null : s.id))}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-left text-[12px] font-semibold ${
              open === s.id ? "border-gold bg-bg2" : "border-line"
            }`}
          >
            <span className="mr-1.5 text-mute">{i + 1}</span>
            {s.text}
          </button>
        ))}
      </div>
      {current && (
        <div className="mt-3 rounded-2xl bg-bg2 px-4 py-3 text-[14px]">
          <p className="flex items-center gap-2 font-semibold">
            <ChevronDown size={14} />
            {current.text}
          </p>
          <p className="mt-1 text-mute">{current.detail}</p>
        </div>
      )}
    </motion.div>
  );
}
