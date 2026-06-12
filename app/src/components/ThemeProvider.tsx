import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolved = useThemeStore((s) => s.resolved);
  const mounted = useRef(false);

  // Appliquer dès le montage ET à chaque changement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
    mounted.current = true;
  }, [resolved]);

  return <>{children}</>;
}
