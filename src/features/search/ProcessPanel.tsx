import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Inbox,
  MessageCircle,
  Newspaper,
  Package,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ProcessStep } from "@/types";
import { springSoft } from "@/lib/motion";

const ICONS = {
  think: Sparkles,
  chat: MessageCircle,
  news: Newspaper,
  search: Search,
  scale: Scale,
  shield: ShieldCheck,
  pack: Package,
  send: Send,
  inbox: Inbox,
};

export function ProcessPanel({
  steps,
  activeIndex,
  collapsed,
  onToggle,
}: {
  steps: ProcessStep[];
  activeIndex: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const visible = steps.slice(0, Math.max(0, activeIndex + 1));
  const current = steps[Math.min(activeIndex, steps.length - 1)];

  return (
    <div className="surface overflow-hidden rounded-3xl">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mute">Что я сейчас делаю</p>
          <p className="mt-0.5 text-[14px] font-semibold">{current?.text ?? "Aura думает"}</p>
        </div>
        <motion.span animate={{ rotate: collapsed ? 0 : 180 }} className="text-mute">
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line"
          >
            <div className="space-y-1 px-3 py-3">
              {visible.map((s, i) => {
                const Icon = ICONS[s.icon];
                const active = i === activeIndex;
                const done = i < activeIndex;
                return (
                  <motion.li
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springSoft}
                    className={`flex items-center gap-3 rounded-2xl px-2 py-2 ${active ? "bg-bg2" : ""}`}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full ${
                        active ? "bg-accent text-white" : done ? "bg-ok/15 text-ok" : "bg-bg2 text-mute"
                      }`}
                    >
                      <motion.span
                        animate={active ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                        transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
                      >
                        <Icon size={15} />
                      </motion.span>
                    </span>
                    <span className={`text-[13px] ${active ? "font-semibold" : "text-mute"}`}>{s.text}</span>
                  </motion.li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
