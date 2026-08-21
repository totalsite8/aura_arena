import { create } from 'zustand'

interface UiState {
  howOpen: boolean
  installOpen: boolean
  setHowOpen: (v: boolean) => void
  setInstallOpen: (v: boolean) => void
}

export const useUi = create<UiState>((set) => ({
  howOpen: false,
  installOpen: false,
  setHowOpen: (v) => set({ howOpen: v }),
  setInstallOpen: (v) => set({ installOpen: v }),
}))
