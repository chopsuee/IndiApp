import type { Badge } from './badge';

export type QuizCategory =
  | 'map-geography'
  | 'regional-organizations'
  | 'timeline-history'
  | 'regionalism-globalization'
  | 'geopolitics';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  xpValue: number;
}

export interface QuizSession {
  category: QuizCategory;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  startTime: number;
  endTime?: number;
}

export interface QuizResult {
  category: QuizCategory;
  score: number;
  xpEarned: number;
  timeTakenMs: number;
  correctCount: number;
  totalCount: number;
  badgesUnlocked: Badge[];
  completedAt: string;
}
