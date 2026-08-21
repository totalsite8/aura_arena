import { useEffect, useMemo } from "react";
import { useAuraStore } from "@/store/useAuraStore";

function systemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useTheme() {
  const pref = useAuraStore((s) => s.theme);
  const setTheme = useAuraStore((s) => s.setTheme);

  const resolved = useMemo(() => {
    if (pref === "system") return "pending";
    return pref;
  }, [pref]);

  useEffect(() => {
    const apply = () => {
      const dark = pref === "dark" || (pref === "system" && systemDark());
      const theme = dark ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", dark ? "#07080b" : "#eef0f4");
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pref]);

  return { pref, resolved, setTheme };
}
