import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseCountUpOptions {
  /** The target value to count up to. */
  target: number;
  /** Animation duration in milliseconds. Defaults to 1500. */
  duration?: number;
  /** Whether to start the animation. Defaults to true. */
  enabled?: boolean;
}

/**
 * Animates a number from 0 to `target` over `duration` milliseconds using
 * `requestAnimationFrame`. Returns 0 immediately (no animation) when the
 * user has requested reduced motion.
 *
 * Requirements: 3.7
 */
export function useCountUp({
  target,
  duration = 1500,
  enabled = true,
}: UseCountUpOptions): number {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // When reduced motion is preferred, skip animation and return target directly.
    if (shouldReduceMotion) {
      setCount(target);
      return;
    }

    if (!enabled) {
      setCount(0);
      return;
    }

    // Reset before starting a new animation.
    setCount(0);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a natural deceleration feel.
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, enabled, shouldReduceMotion]);

  return count;
}
