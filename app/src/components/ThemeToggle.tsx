import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeToggle({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { resolved, toggle } = useThemeStore();
  const isDark = resolved === 'dark';
  const s = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <button
      onClick={toggle}
      className={`${s} rounded-full flex items-center justify-center transition-all duration-300`}
      style={{
        background: isDark ? 'rgba(212,168,83,0.08)' : 'rgba(184,147,47,0.10)',
        border: `1px solid ${isDark ? 'rgba(212,168,83,0.15)' : 'rgba(184,147,47,0.20)'}`,
        color: 'var(--gold)',
      }}
      title={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
    >
      {isDark ? <Moon className={iconSize} /> : <Sun className={iconSize} />}
    </button>
  );
}
