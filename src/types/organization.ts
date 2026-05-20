export type OrgCategory = 'Economic' | 'Security' | 'Political';

export interface MemberCountry {
  name: string;
  flag: string;
}

export interface Organization {
  id: string;
  name: string;
  acronym: string;
  foundingYear: number;
  memberCount: number;
  overview: string;
  objectives: string[];
  memberCountries: MemberCountry[];
  indiaRole: string;
  indiaContributions: string[];
  asianRegionalismImpact: string;
  category: OrgCategory;
  slug: string;
}
