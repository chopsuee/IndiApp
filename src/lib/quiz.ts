import type { QuizQuestion, QuizResult, Badge, UserProgress, QuizCategory } from '@/types';

/**
 * Returns 'correct' if selectedIndex matches correctAnswerIndex, 'incorrect' otherwise.
 */
export function getAnswerFeedback(
  correctAnswerIndex: number,
  selectedIndex: number
): 'correct' | 'incorrect' {
  return selectedIndex === correctAnswerIndex ? 'correct' : 'incorrect';
}

/**
 * Calculates total XP earned for a quiz session.
 * Sums xpValue for each correctly answered question.
 * Adds 50 bonus XP if and only if ALL questions are answered correctly (perfect score).
 */
export function calculateXP(
  questions: QuizQuestion[],
  answers: (number | null)[]
): number {
  const correctXP = questions.reduce((sum, q, i) => {
    return answers[i] === q.correctAnswerIndex ? sum + q.xpValue : sum;
  }, 0);
  const allCorrect =
    questions.length > 0 &&
    questions.every((q, i) => answers[i] === q.correctAnswerIndex);
  return allCorrect ? correctXP + 50 : correctXP;
}

/**
 * Calculates score as a fraction: correct / total (0.0–1.0).
 * Returns 0 if questions array is empty.
 */
export function calculateScore(
  answers: (number | null)[],
  questions: QuizQuestion[]
): number {
  if (questions.length === 0) return 0;
  const correct = questions.filter((q, i) => answers[i] === q.correctAnswerIndex).length;
  return correct / questions.length;
}

/**
 * Returns true iff score >= 0.80 (80%).
 */
export function shouldShowCertificate(score: number): boolean {
  return score >= 0.8;
}

/**
 * Sorts an array of UserProgress by totalXP descending (stable sort).
 * Does not mutate the original array.
 */
export function sortLeaderboard(users: UserProgress[]): UserProgress[] {
  return [...users].sort((a, b) => b.totalXP - a.totalXP);
}

/**
 * Evaluates all BadgeCondition types and returns newly unlocked badges.
 * A badge is newly unlocked if:
 * - It is not already in `existing`
 * - Its unlock condition is satisfied by `result`
 *
 * BadgeCondition types:
 * - 'category_complete': result.category matches badge.unlockCondition.category
 * - 'perfect_score': result.score === 1.0 (optionally filtered by category)
 * - 'xp_threshold': result.xpEarned >= badge.unlockCondition.xpThreshold
 * - 'all_categories': not evaluated here (requires full history context)
 */
export function unlockBadges(
  result: QuizResult,
  existing: Badge[],
  allBadges: Badge[]
): Badge[] {
  const existingIds = new Set(existing.map((b) => b.id));
  const now = new Date().toISOString();

  return allBadges
    .filter((badge) => {
      if (existingIds.has(badge.id)) return false;
      const { type, category, xpThreshold } = badge.unlockCondition;
      switch (type) {
        case 'category_complete':
          return category === result.category;
        case 'perfect_score':
          return result.score === 1.0 && (!category || category === result.category);
        case 'xp_threshold':
          return result.xpEarned >= (xpThreshold ?? 0);
        case 'all_categories':
          return false; // requires full history — handled at results page level
        default:
          return false;
      }
    })
    .map((badge) => ({ ...badge, unlockedAt: now }));
}
