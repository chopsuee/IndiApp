import { describe, it, expect } from 'vitest';
import { calculateXP, calculateScore, shouldShowCertificate, sortLeaderboard } from './quiz';
import type { QuizQuestion, UserProgress } from '@/types';

const mockQuestions: QuizQuestion[] = [
  { id: 'q1', category: 'geopolitics', question: 'Q1', options: ['A','B','C','D'], correctAnswerIndex: 0, explanation: 'E1', xpValue: 10 },
  { id: 'q2', category: 'geopolitics', question: 'Q2', options: ['A','B','C','D'], correctAnswerIndex: 1, explanation: 'E2', xpValue: 20 },
  { id: 'q3', category: 'geopolitics', question: 'Q3', options: ['A','B','C','D'], correctAnswerIndex: 2, explanation: 'E3', xpValue: 15 },
];

const emptyCategoryXP = {
  'map-geography': 0,
  'regional-organizations': 0,
  'timeline-history': 0,
  'regionalism-globalization': 0,
  'geopolitics': 0,
};

describe('Quiz integration', () => {
  it('calculates XP correctly for partial correct answers', () => {
    const answers = [0, 0, 2]; // q1 correct, q2 wrong, q3 correct
    expect(calculateXP(mockQuestions, answers)).toBe(25); // 10 + 15, no bonus
  });

  it('adds bonus XP for perfect score', () => {
    const answers = [0, 1, 2]; // all correct
    expect(calculateXP(mockQuestions, answers)).toBe(95); // 10+20+15+50 bonus
  });

  it('calculates score as fraction', () => {
    const answers = [0, 0, 2]; // 2/3 correct
    expect(calculateScore(answers, mockQuestions)).toBeCloseTo(2/3);
  });

  it('shows certificate for score >= 0.80', () => {
    expect(shouldShowCertificate(0.80)).toBe(true);
    expect(shouldShowCertificate(1.0)).toBe(true);
    expect(shouldShowCertificate(0.79)).toBe(false);
  });

  it('sorts leaderboard by totalXP descending', () => {
    const users: UserProgress[] = [
      { totalXP: 100, categoryXP: emptyCategoryXP, unlockedBadges: [], quizHistory: [], displayName: 'Alice' },
      { totalXP: 300, categoryXP: emptyCategoryXP, unlockedBadges: [], quizHistory: [], displayName: 'Bob' },
      { totalXP: 200, categoryXP: emptyCategoryXP, unlockedBadges: [], quizHistory: [], displayName: 'Carol' },
    ];
    const sorted = sortLeaderboard(users);
    expect(sorted[0].displayName).toBe('Bob');
    expect(sorted[1].displayName).toBe('Carol');
    expect(sorted[2].displayName).toBe('Alice');
  });
});
