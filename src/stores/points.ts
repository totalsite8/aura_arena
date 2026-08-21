import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PointEntry {
  id: number
  text: string
  amount: number
  date: string
}

interface PointsState {
  balance: number
  history: PointEntry[]
  add: (amount: number, text: string) => void
}

export const usePoints = create<PointsState>()(
  persist(
    (set) => ({
      balance: 1000,
      history: [
        {
          id: 2,
          text: 'Приветственные баллы',
          amount: 1000,
          date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
        },
      ],
      add: (amount, text) =>
        set((s) => ({
          balance: s.balance + amount,
          history: [
            {
              id: Date.now(),
              text,
              amount,
              date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
            },
            ...s.history,
          ].slice(0, 20),
        })),
    }),
    { name: 'aura.points' }
  )
)
