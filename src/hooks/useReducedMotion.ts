import { useReducedMotion as useMotionReducedMotion } from 'motion/react';

/**
 * Wraps Motion's `useReducedMotion` hook for app-wide use.
 *
 * Returns `true` when the user has requested reduced motion via the
 * `prefers-reduced-motion` media query, `false` when they have not, and
 * `null` during SSR (before the media query can be evaluated).
 */
export function useReducedMotion(): boolean | null {
  return useMotionReducedMotion();
}
