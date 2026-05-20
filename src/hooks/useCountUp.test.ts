import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountUp } from './useCountUp';

// Mock useReducedMotion so we can control it in tests
vi.mock('./useReducedMotion', () => ({
  useReducedMotion: vi.fn(),
}));

import { useReducedMotion } from './useReducedMotion';

const mockUseReducedMotion = vi.mocked(useReducedMotion);

describe('useCountUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('when reduced motion is active', () => {
    beforeEach(() => {
      mockUseReducedMotion.mockReturnValue(true);
    });

    it('returns the target value immediately without animation', () => {
      const { result } = renderHook(() =>
        useCountUp({ target: 100, duration: 1500 })
      );
      expect(result.current).toBe(100);
    });

    it('returns 0 for a target of 0', () => {
      const { result } = renderHook(() =>
        useCountUp({ target: 0, duration: 1500 })
      );
      expect(result.current).toBe(0);
    });

    it('returns the target immediately for large values', () => {
      const { result } = renderHook(() =>
        useCountUp({ target: 1_000_000, duration: 2000 })
      );
      expect(result.current).toBe(1_000_000);
    });
  });

  describe('when reduced motion is not active', () => {
    beforeEach(() => {
      mockUseReducedMotion.mockReturnValue(false);
    });

    it('starts at 0', () => {
      const { result } = renderHook(() =>
        useCountUp({ target: 100, duration: 1000 })
      );
      // Before any rAF fires, count should be 0
      expect(result.current).toBe(0);
    });

    it('reaches the target value after the full duration', () => {
      const { result } = renderHook(() =>
        useCountUp({ target: 100, duration: 1000 })
      );

      // Advance time past the full duration
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current).toBe(100);
    });

    it('returns 0 when enabled is false', () => {
      const { result } = renderHook(() =>
        useCountUp({ target: 100, duration: 1000, enabled: false })
      );
      expect(result.current).toBe(0);
    });

    it('updates when target changes', () => {
      const { result, rerender } = renderHook(
        ({ target }: { target: number }) => useCountUp({ target, duration: 1000 }),
        { initialProps: { target: 50 } }
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current).toBe(50);

      rerender({ target: 200 });

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current).toBe(200);
    });
  });

  describe('when reduced motion is null (SSR)', () => {
    beforeEach(() => {
      mockUseReducedMotion.mockReturnValue(null);
    });

    it('starts animation (null is treated as no preference)', () => {
      const { result } = renderHook(() =>
        useCountUp({ target: 100, duration: 1000 })
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current).toBe(100);
    });
  });
});
