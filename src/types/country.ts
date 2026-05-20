export type RelationshipCategory = 'ally' | 'partner' | 'neutral' | 'rival';

export interface Country {
  id: string;
  name: string;
  flag: string;
  relationshipCategory: RelationshipCategory;
  tradeSummary: string;
  diplomaticTiesSummary: string;
  allianceMemberships: string[];
  culturalInfluenceNotes: string;
  cooperationScore: number; // 0–100
  conflictScore: number;    // 0–100
}
