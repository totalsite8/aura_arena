import { create } from 'zustand'

export type ThemeMode = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'aura.theme'

function resolvePreferred(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') return mode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyDom(mode: ThemeMode) {
  const resolved = resolvePreferred(mode)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
}

interface ThemeState {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
}

export const useTheme = create<ThemeState>((set) => {
  const saved = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as ThemeMode | null
  const initial: ThemeMode = saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
  if (typeof document !== 'undefined') applyDom(initial)

  // системная тема: следим за изменениями
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const st = useTheme.getState()
      if (st.mode === 'system') applyDom('system')
    })
  }

  return {
    mode: initial,
    setMode: (m) => {
      localStorage.setItem(STORAGE_KEY, m)
      applyDom(m)
      set({ mode: m })
    },
  }
})
