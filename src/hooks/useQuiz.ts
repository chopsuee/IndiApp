'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { QuizCategory, QuizQuestion, QuizSession, QuizResult } from '@/types/quiz';
import type { Badge } from '@/types/badge';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Bonus XP awarded when every question in a session is answered correctly. */
const PERFECT_SCORE_BONUS_XP = 50;

/** Default seconds allowed per question. */
const DEFAULT_SECONDS_PER_QUESTION = 30;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Sum the xpValue for each correctly answered question.
 * Adds PERFECT_SCORE_BONUS_XP if and only if every question was correct.
 */
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

/**
 * Evaluate badge unlock conditions against the completed quiz result.
 * Returns only badges that are newly unlocked (not already in `existing`).
 */
function evaluateBadges(
  result: QuizResult,
  existing: Badge[],
  allBadges: Badge[]
): Badge[] {
  const existingIds = new Set(existing.map((b) => b.id));
  const now = new Date().toISOString();

  return allBadges
    .filter((badge) => {
      if (existingIds.has(badge.id)) return false;

      const { type, category, xpThreshold, minScore } = badge.unlockCondition;

      switch (type) {
        case 'category_complete':
          return category === result.category;

        case 'perfect_score':
          return (
            (category === undefined || category === result.category) &&
            result.score >= 1.0
          );

        case 'xp_threshold':
          return (
            xpThreshold !== undefined && result.xpEarned >= xpThreshold
          );

        case 'all_categories':
          // Cannot determine from a single result — caller must handle this
          return false;

        default:
          return false;
      }
    })
    .map((badge) => ({ ...badge, unlockedAt: now }));
}

// ---------------------------------------------------------------------------
// Hook state types
// ---------------------------------------------------------------------------

export interface QuizHookResult {
  /** The active quiz session, or null if not yet initialised. */
  session: QuizSession | null;
  /** The current question being displayed, or null if session is not active. */
  currentQuestion: QuizQuestion | null;
  /**
   * Submit an answer for the current question.
   * @param index - The 0-based index of the selected option (0–3).
   */
  submitAnswer: (index: number) => void;
  /** Seconds remaining for the current question. */
  timeRemaining: number;
  /** True once all questions have been answered (or time ran out on the last). */
  isComplete: boolean;
  /** The computed result, available once `isComplete` is true. */
  result: QuizResult | null;
  /** Re-initialise the session with the same category and a fresh set of questions. */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// useQuiz
// ---------------------------------------------------------------------------

/**
 * State machine hook for a quiz session.
 *
 * @param category - The quiz category to load questions for.
 * @param secondsPerQuestion - Timer duration per question (default 30 s).
 * @param existingBadges - Badges the user has already unlocked (for delta calculation).
 * @param allBadges - The full badge catalogue (for unlock evaluation).
 * @param initialQuestions - Optional pre-loaded questions (used in tests to bypass dynamic import).
 */
export function useQuiz(
  category: QuizCategory | null,
  secondsPerQuestion: number = DEFAULT_SECONDS_PER_QUESTION,
  existingBadges: Badge[] = [],
  allBadges: Badge[] = [],
  initialQuestions?: QuizQuestion[]
): QuizHookResult {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(secondsPerQuestion);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Track whether the component is still mounted to avoid state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Session initialisation — load questions when category changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!category) return;

    let cancelled = false;

    async function loadSession() {
      try {
        // Use pre-loaded questions if provided (e.g., in tests), otherwise
        // dynamically import from the data directory.
        let questions: QuizQuestion[];
        if (initialQuestions !== undefined) {
          questions = initialQuestions;
        } else {
          const mod = await import(`@/data/quiz/${category}.json`);
          questions = mod.default as QuizQuestion[];
        }

        if (cancelled || !mountedRef.current) return;

        const newSession: QuizSession = {
          category: category!,
          questions,
          currentIndex: 0,
          answers: new Array(questions.length).fill(null),
          startTime: Date.now(),
        };

        setSession(newSession);
        setTimeRemaining(secondsPerQuestion);
        setIsComplete(false);
        setResult(null);
      } catch {
        // If the data file is missing, initialise with an empty session so the
        // UI can show an appropriate error state.
        if (cancelled || !mountedRef.current) return;

        const emptySession: QuizSession = {
          category: category!,
          questions: [],
          currentIndex: 0,
          answers: [],
          startTime: Date.now(),
        };
        setSession(emptySession);
        setIsComplete(true);
        setResult(null);
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, secondsPerQuestion]);

  // ---------------------------------------------------------------------------
  // Timer countdown
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!session || isComplete) return;
    if (session.questions.length === 0) return;

    // Reset timer whenever the current question index changes
    setTimeRemaining(secondsPerQuestion);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time ran out — auto-advance (answer stays null)
          clearInterval(interval);
          advanceOrComplete(session);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.currentIndex, isComplete]);

  // ---------------------------------------------------------------------------
  // Internal: advance to next question or complete the session
  // ---------------------------------------------------------------------------
  const advanceOrComplete = useCallback(
    (currentSession: QuizSession) => {
      if (!mountedRef.current) return;

      const nextIndex = currentSession.currentIndex + 1;

      if (nextIndex >= currentSession.questions.length) {
        // Session complete
        const endTime = Date.now();
        const finalSession: QuizSession = {
          ...currentSession,
          endTime,
        };

        const correctCount = currentSession.answers.filter(
          (ans, i) => ans === currentSession.questions[i].correctAnswerIndex
        ).length;
        const totalCount = currentSession.questions.length;
        const score = totalCount > 0 ? correctCount / totalCount : 0;
        const xpEarned = computeXP(currentSession.questions, currentSession.answers);

        const quizResult: QuizResult = {
          category: currentSession.category,
          score,
          xpEarned,
          timeTakenMs: endTime - currentSession.startTime,
          correctCount,
          totalCount,
          badgesUnlocked: evaluateBadges(
            {
              category: currentSession.category,
              score,
              xpEarned,
              timeTakenMs: endTime - currentSession.startTime,
              correctCount,
              totalCount,
              badgesUnlocked: [],
              completedAt: new Date(endTime).toISOString(),
            },
            existingBadges,
            allBadges
          ),
          completedAt: new Date(endTime).toISOString(),
        };

        setSession(finalSession);
        setIsComplete(true);
        setResult(quizResult);
      } else {
        // Advance to next question
        setSession((prev) => {
          if (!prev) return prev;
          return { ...prev, currentIndex: nextIndex };
        });
        setTimeRemaining(secondsPerQuestion);
      }
    },
    [existingBadges, allBadges, secondsPerQuestion]
  );

  // ---------------------------------------------------------------------------
  // submitAnswer
  // ---------------------------------------------------------------------------
  const submitAnswer = useCallback(
    (index: number) => {
      if (!session || isComplete) return;

      // Record the answer
      const updatedAnswers = [...session.answers];
      updatedAnswers[session.currentIndex] = index;

      const updatedSession: QuizSession = {
        ...session,
        answers: updatedAnswers,
      };

      setSession(updatedSession);
      advanceOrComplete(updatedSession);
    },
    [session, isComplete, advanceOrComplete]
  );

  // ---------------------------------------------------------------------------
  // reset
  // ---------------------------------------------------------------------------
  const reset = useCallback(() => {
    if (!category) return;

    // Re-trigger the load effect by clearing session first
    setSession(null);
    setIsComplete(false);
    setResult(null);
    setTimeRemaining(secondsPerQuestion);

    // Re-run the load by toggling — we do this by re-importing
    async function reloadSession() {
      try {
        const mod = await import(`@/data/quiz/${category}.json`);
        const questions: QuizQuestion[] = mod.default as QuizQuestion[];

        if (!mountedRef.current) return;

        setSession({
          category: category!,
          questions,
          currentIndex: 0,
          answers: new Array(questions.length).fill(null),
          startTime: Date.now(),
        });
        setTimeRemaining(secondsPerQuestion);
      } catch {
        if (!mountedRef.current) return;
        setSession({
          category: category!,
          questions: [],
          currentIndex: 0,
          answers: [],
          startTime: Date.now(),
        });
        setIsComplete(true);
      }
    }

    reloadSession();
  }, [category, secondsPerQuestion]);

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------
  const currentQuestion: QuizQuestion | null =
    session && !isComplete && session.questions.length > 0
      ? session.questions[session.currentIndex] ?? null
      : null;

  return {
    session,
    currentQuestion,
    submitAnswer,
    timeRemaining,
    isComplete,
    result,
    reset,
  };
}
