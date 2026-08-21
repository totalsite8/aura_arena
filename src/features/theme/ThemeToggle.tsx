import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { ThemePref } from "@/types";

const ORDER: ThemePref[] = ["system", "light", "dark"];
const LABEL: Record<ThemePref, string> = {
  system: "Как в системе",
  light: "Светлая",
  dark: "Тёмная",
};

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { pref, setTheme } = useTheme();
  const Icon = pref === "light" ? Sun : pref === "dark" ? Moon : Monitor;
  const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length] ?? "system";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold text-ink"
      aria-label={`Тема: ${LABEL[pref]}. Сменить`}
      title={LABEL[pref]}
    >
      <Icon size={16} />
      {!compact && <span className="hidden sm:inline">{LABEL[pref]}</span>}
    </button>
  );
}
