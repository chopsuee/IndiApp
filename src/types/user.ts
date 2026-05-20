import type { QuizCategory } from './quiz';
import type { Badge } from './badge';
import type { QuizResult } from './quiz';

export interface UserProgress {
  totalXP: number;
  categoryXP: Record<QuizCategory, number>;
  unlockedBadges: Badge[];
  quizHistory: QuizResult[];
  displayName: string;
}
