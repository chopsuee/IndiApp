'use client';

import { useEffect } from 'react';
import { useTheme } from '@/hooks';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Client-side theme provider that applies the resolved theme class
 * to `document.documentElement` and renders children.
 *
 * This must be a 'use client' component because `useTheme` reads from
 * localStorage and calls `window.matchMedia`, both of which are
 * browser-only APIs.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}

export default ThemeProvider;
