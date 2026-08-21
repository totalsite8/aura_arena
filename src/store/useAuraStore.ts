import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemePref, Tx } from "@/types";

interface AuraState {
  theme: ThemePref;
  city: string;
  points: number;
  transactions: Tx[];
  setTheme: (t: ThemePref) => void;
  setCity: (c: string) => void;
  addPoints: (n: number, label: string) => void;
}

const SEED_TX: Tx[] = [
  { id: "t1", delta: 1000, label: "Стартовые баллы — просто так", at: "сегодня" },
  { id: "t2", delta: 50, label: "Добрый день от Aura", at: "вчера" },
];

export const useAuraStore = create<AuraState>()(
  persist(
    (set, get) => ({
      theme: "system",
      city: "Москва",
      points: 1000,
      transactions: SEED_TX,
      setTheme: (theme) => set({ theme }),
      setCity: (city) => set({ city }),
      addPoints: (n, label) => {
        const points = get().points + n;
        const tx: Tx = { id: `tx-${Date.now()}`, delta: n, label, at: "только что" };
        set({ points, transactions: [tx, ...get().transactions].slice(0, 12) });
      },
    }),
    { name: "aura-demo" },
  ),
);
