'use client';

import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';

type Theme = 'dark' | 'light';

/**
 * Manages the application colour theme.
 *
 * - Reads the stored theme from `localStorage` (key: `'theme'`).
 * - When no stored value exists, falls back to the OS preference via
 *   `window.matchMedia('(prefers-color-scheme: dark)')`.
 * - Applies `'dark'` or `'light'` as a class on `document.documentElement`.
 * - SSR-safe: always returns `'light'` on the server / first render to
 *   prevent hydration mismatches. The real theme is applied after mount.
 *
 * Requirements: 2.4, 2.5
 */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme | null>('theme', null);

  // Start with 'light' on both server and client first render to avoid
  // hydration mismatch. The real value is resolved after mount.
  const [resolvedTheme, setResolvedTheme] = useState<Theme>('light');

  useEffect(() => {
    // After mount, resolve the real theme from storage or OS preference.
    const real: Theme =
      storedTheme ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setResolvedTheme(real);
  }, [storedTheme]);

  // Apply the theme class to <html> whenever it changes.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const toggleTheme = () => {
    const next: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setStoredTheme(next);
    setResolvedTheme(next);
  };

  return { theme: resolvedTheme, toggleTheme };
}

export default useTheme;
