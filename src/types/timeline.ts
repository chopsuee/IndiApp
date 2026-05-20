export type TimelineCategory = 'Economic' | 'Diplomatic' | 'Technology' | 'Space' | 'Regional';

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  category: TimelineCategory;
  briefDescription: string;
  detailedDescription: string;
  imageUrl?: string;
  iconName?: string;
}
