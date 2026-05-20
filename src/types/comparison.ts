export type ComparisonStrength = 'low' | 'medium' | 'high';

export interface ComparisonItem {
  topic: string;
  regionalismValue: ComparisonStrength;
  globalizationValue: ComparisonStrength;
  regionalismDescription: string;
  globalizationDescription: string;
  infographicData?: Record<string, number>;
}
