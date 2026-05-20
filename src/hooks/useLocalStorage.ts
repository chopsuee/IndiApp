'use client';

import { useState, useCallback } from 'react';

/**
 * Generic typed hook for reading and writing a value to `localStorage`.
 *
 * SSR-safe: checks `typeof window !== 'undefined'` before accessing
 * `localStorage`. All reads and writes are wrapped in try/catch so that
 * environments where `localStorage` is unavailable (e.g. private browsing
 * with storage blocked) fall back gracefully to in-memory state.
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
  // Initialise state from localStorage (or fall back to initialValue).
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        // Resolve functional updates the same way useState does.
        const resolved =
          typeof value === 'function'
            ? (value as (val: T) => T)(prev)
            : value;

        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          } catch {
            // localStorage unavailable — state is still updated in memory.
          }
        }

        return resolved;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}

export default useLocalStorage;
