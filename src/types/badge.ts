import type { QuizCategory } from './quiz';

export interface BadgeCondition {
  type: 'category_complete' | 'perfect_score' | 'xp_threshold' | 'all_categories';
  category?: QuizCategory;
  xpThreshold?: number;
  minScore?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockCondition: BadgeCondition;
  unlockedAt?: string;
}
