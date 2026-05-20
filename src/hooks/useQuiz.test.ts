/**
 * Tests for useQuiz hook — covers XP calculation, score computation,
 * and the session state machine logic.
 *
 * Requirements: 9.3, 9.5, 9.8
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { QuizQuestion } from '@/types/quiz';
import { useQuiz } from './useQuiz';

// ---------------------------------------------------------------------------
// Inline helpers mirroring the hook's internal logic (tested independently)
// ---------------------------------------------------------------------------

const PERFECT_SCORE_BONUS_XP = 50;

function computeXP(
  questions: QuizQuestion[],
  answers: (number | null)[]
): number {
  let xp = 0;
  let allCorrect = questions.length > 0;

  for (let i = 0; i < questions.length; i++) {
    const isCorrect = answers[i] === questions[i].correctAnswerIndex;
    if (isCorrect) {
      xp += questions[i].xpValue;
    } else {
      allCorrect = false;
    }
  }

  if (allCorrect) {
    xp += PERFECT_SCORE_BONUS_XP;
  }

  return xp;
}

function calculateScore(
  answers: (number | null)[],
  questions: QuizQuestion[]
): number {
  if (questions.length === 0) return 0;
  const correct = answers.filter(
    (ans, i) => ans === questions[i].correctAnswerIndex
  ).length;
  return correct / questions.length;
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const makeQuestion = (
  id: string,
  correctAnswerIndex: number,
  xpValue: number
): QuizQuestion => ({
  id,
  category: 'geopolitics',
  question: `Question ${id}`,
  options: ['A', 'B', 'C', 'D'],
  correctAnswerIndex,
  explanation: `Explanation for ${id}`,
  xpValue,
});

const q1 = makeQuestion('q1', 0, 10);
const q2 = makeQuestion('q2', 1, 20);
const q3 = makeQuestion('q3', 2, 15);

// ---------------------------------------------------------------------------
// XP calculation tests (Requirement 9.5)
// ---------------------------------------------------------------------------

describe('computeXP', () => {
  it('returns 0 for an empty question list', () => {
    expect(computeXP([], [])).toBe(0);
  });

  it('sums xpValue only for correct answers', () => {
    // q1 correct (10 XP), q2 wrong (0), q3 correct (15 XP) → 25 XP (no bonus)
    const answers: (number | null)[] = [0, 0, 2];
    expect(computeXP([q1, q2, q3], answers)).toBe(25);
  });

  it('adds bonus XP when all answers are correct', () => {
    const answers: (number | null)[] = [0, 1, 2];
    // 10 + 20 + 15 + 50 bonus = 95
    expect(computeXP([q1, q2, q3], answers)).toBe(95);
  });

  it('does NOT add bonus XP when any answer is wrong', () => {
    const answers: (number | null)[] = [0, 1, 0]; // q3 wrong
    expect(computeXP([q1, q2, q3], answers)).toBe(30); // 10 + 20, no bonus
  });

  it('does NOT add bonus XP when any answer is null (unanswered)', () => {
    const answers: (number | null)[] = [0, 1, null];
    expect(computeXP([q1, q2, q3], answers)).toBe(30); // 10 + 20, no bonus
  });

  it('adds bonus XP for a single-question session answered correctly', () => {
    expect(computeXP([q1], [0])).toBe(10 + PERFECT_SCORE_BONUS_XP);
  });

  it('returns 0 XP for all wrong answers (no bonus)', () => {
    const answers: (number | null)[] = [3, 3, 3];
    expect(computeXP([q1, q2, q3], answers)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Score calculation tests (Requirement 9.3, 9.8)
// ---------------------------------------------------------------------------

describe('calculateScore', () => {
  it('returns 0 for empty questions', () => {
    expect(calculateScore([], [])).toBe(0);
  });

  it('returns 1.0 for all correct answers', () => {
    expect(calculateScore([0, 1, 2], [q1, q2, q3])).toBe(1.0);
  });

  it('returns 0.0 for all wrong answers', () => {
    expect(calculateScore([3, 3, 3], [q1, q2, q3])).toBe(0);
  });

  it('returns correct fraction for partial correct answers', () => {
    // q1 correct, q2 wrong, q3 correct → 2/3
    expect(calculateScore([0, 0, 2], [q1, q2, q3])).toBeCloseTo(2 / 3);
  });

  it('treats null answers as incorrect', () => {
    expect(calculateScore([0, null, null], [q1, q2, q3])).toBeCloseTo(1 / 3);
  });
});

// ---------------------------------------------------------------------------
// Certificate threshold tests (Requirement 9.8)
// ---------------------------------------------------------------------------

describe('shouldShowCertificate', () => {
  function shouldShowCertificate(score: number): boolean {
    return score >= 0.8;
  }

  it('shows certificate at exactly 0.80', () => {
    expect(shouldShowCertificate(0.8)).toBe(true);
  });

  it('shows certificate above 0.80', () => {
    expect(shouldShowCertificate(1.0)).toBe(true);
    expect(shouldShowCertificate(0.9)).toBe(true);
  });

  it('does not show certificate below 0.80', () => {
    expect(shouldShowCertificate(0.79)).toBe(false);
    expect(shouldShowCertificate(0.5)).toBe(false);
    expect(shouldShowCertificate(0.0)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// useQuiz hook integration tests
// ---------------------------------------------------------------------------

describe('useQuiz hook', () => {
  const mockQuestions: QuizQuestion[] = [
    makeQuestion('q1', 0, 10),
    makeQuestion('q2', 1, 20),
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initialises with null session when category is null', () => {
    const { result } = renderHook(() => useQuiz(null));

    expect(result.current.session).toBeNull();
    expect(result.current.currentQuestion).toBeNull();
    expect(result.current.isComplete).toBe(false);
    expect(result.current.result).toBeNull();
  });

  it('loads questions and sets up session when category is provided', () => {
    // Pass initialQuestions to bypass dynamic import
    const { result } = renderHook(() => useQuiz('geopolitics', 30, [], [], mockQuestions));

    expect(result.current.session).not.toBeNull();
    expect(result.current.session?.category).toBe('geopolitics');
    expect(result.current.session?.currentIndex).toBe(0);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.currentQuestion).not.toBeNull();
  });

  it('advances to next question after submitAnswer', () => {
    const { result } = renderHook(() => useQuiz('geopolitics', 30, [], [], mockQuestions));

    expect(result.current.session?.questions.length).toBeGreaterThan(0);

    act(() => {
      result.current.submitAnswer(0); // answer q1
    });

    expect(result.current.session?.currentIndex).toBe(1);
  });

  it('completes session after all questions are answered', () => {
    const { result } = renderHook(() => useQuiz('geopolitics', 30, [], [], mockQuestions));

    expect(result.current.session?.questions.length).toBe(2);

    act(() => {
      result.current.submitAnswer(0); // answer q1 correctly
    });

    expect(result.current.session?.currentIndex).toBe(1);

    act(() => {
      result.current.submitAnswer(1); // answer q2 correctly
    });

    expect(result.current.isComplete).toBe(true);
    expect(result.current.result).not.toBeNull();
    expect(result.current.result?.correctCount).toBe(2);
    expect(result.current.result?.totalCount).toBe(2);
    expect(result.current.result?.score).toBe(1.0);
  });

  it('calculates XP with bonus for perfect score', () => {
    const { result } = renderHook(() => useQuiz('geopolitics', 30, [], [], mockQuestions));

    expect(result.current.session?.questions.length).toBe(2);

    act(() => {
      result.current.submitAnswer(0); // q1 correct (10 XP)
    });

    act(() => {
      result.current.submitAnswer(1); // q2 correct (20 XP)
    });

    expect(result.current.isComplete).toBe(true);
    // 10 + 20 + 50 bonus = 80
    expect(result.current.result?.xpEarned).toBe(80);
  });

  it('calculates XP without bonus for imperfect score', () => {
    const { result } = renderHook(() => useQuiz('geopolitics', 30, [], [], mockQuestions));

    expect(result.current.session?.questions.length).toBe(2);

    act(() => {
      result.current.submitAnswer(0); // q1 correct (10 XP)
    });

    act(() => {
      result.current.submitAnswer(0); // q2 wrong (0 XP, correct is 1)
    });

    expect(result.current.isComplete).toBe(true);
    // 10 XP only, no bonus
    expect(result.current.result?.xpEarned).toBe(10);
  });

  it('records answer in session.answers array', () => {
    const { result } = renderHook(() => useQuiz('geopolitics', 30, [], [], mockQuestions));

    expect(result.current.session?.questions.length).toBe(2);

    act(() => {
      result.current.submitAnswer(2); // answer q1 with index 2
    });

    expect(result.current.session?.currentIndex).toBe(1);
    // The answer for q1 (index 0) should be recorded as 2
    expect(result.current.session?.answers[0]).toBe(2);
  });

  it('exposes timeRemaining starting at secondsPerQuestion', () => {
    const { result } = renderHook(() => useQuiz('geopolitics', 45, [], [], mockQuestions));

    expect(result.current.session).not.toBeNull();
    expect(result.current.timeRemaining).toBe(45);
  });

  it('decrements timeRemaining over time', () => {
    const { result } = renderHook(() => useQuiz('geopolitics', 30, [], [], mockQuestions));

    expect(result.current.session?.questions.length).toBeGreaterThan(0);

    act(() => {
      vi.advanceTimersByTime(3000); // 3 seconds
    });

    expect(result.current.timeRemaining).toBeLessThanOrEqual(27);
  });
});
