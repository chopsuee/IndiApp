import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

// Mock motion/react's useReducedMotion so we can control its return value
vi.mock('motion/react', () => ({
  useReducedMotion: vi.fn(),
}));

import { useReducedMotion as useMotionReducedMotion } from 'motion/react';

const mockUseMotionReducedMotion = vi.mocked(useMotionReducedMotion);

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true when Motion reports reduced motion is preferred', () => {
    mockUseMotionReducedMotion.mockReturnValue(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('returns false when Motion reports reduced motion is not preferred', () => {
    mockUseMotionReducedMotion.mockReturnValue(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns null during SSR (before media query can be evaluated)', () => {
    mockUseMotionReducedMotion.mockReturnValue(null);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBeNull();
  });

  it('delegates directly to Motion useReducedMotion', () => {
    mockUseMotionReducedMotion.mockReturnValue(false);
    renderHook(() => useReducedMotion());
    expect(mockUseMotionReducedMotion).toHaveBeenCalledTimes(1);
  });
});
