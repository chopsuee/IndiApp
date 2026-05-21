'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Generic typed hook for reading and writing a value to `localStorage`.
 *
 * SSR-safe: always initialises with `initialValue` on the first render
 * (matching the server), then syncs from `localStorage` after mount via
 * `useEffect`. This prevents hydration mismatches caused by reading
 * `localStorage` during the initial render on the client.
 *
 * Supports functional updates exactly like `useState`:
 *   setValue(prev => prev + 1)
 *
 * Requirements: 9.9
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Always start with initialValue — matches the server render exactly.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // After mount, sync the real value from localStorage.
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // localStorage unavailable — keep initialValue.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const resolved =
          typeof value === 'function'
            ? (value as (val: T) => T)(prev)
            : value;

        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // localStorage unavailable — state is still updated in memory.
        }

        return resolved;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
