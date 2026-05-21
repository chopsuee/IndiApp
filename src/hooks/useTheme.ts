'use client';

import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';

type Theme = 'dark' | 'light';

/**
 * Manages the application colour theme.
 *
 * - Default theme is LIGHT MODE (not dark).
 * - Reads the stored theme from `localStorage` (key: `'theme'`).
 * - When no stored value exists, defaults to 'light' (dark mode is optional).
 * - Users can manually toggle to dark mode if preferred.
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
    // After mount, resolve the real theme from storage.
    // Default to 'light' if no preference is stored (dark mode is optional).
    const real: Theme = storedTheme ?? 'light';
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
