import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

function resolve(theme: Theme): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyToDOM(theme: 'dark' | 'light') {
  document.documentElement.setAttribute('data-theme', theme);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolved: 'dark',

      setTheme: (theme) => {
        const resolved = resolve(theme);
        applyToDOM(resolved);
        set({ theme, resolved });
      },

      toggle: () => {
        const next = get().resolved === 'dark' ? 'light' : 'dark';
        applyToDOM(next);
        set({ theme: next, resolved: next });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolve(state.theme);
          applyToDOM(resolved);
          state.resolved = resolved;
        }
      },
    }
  )
);
