import countries from '@/data/countries.json';
import organizations from '@/data/organizations.json';
import timelineEvents from '@/data/timeline.json';
import comparisonItems from '@/data/comparison.json';
import geopoliticsDimensions from '@/data/geopolitics.json';
import badges from '@/data/badges.json';
import notableFigures from '@/data/notable-figures.json';
import type { Country, Organization, TimelineEvent, ComparisonItem, GeopoliticsDimension, Badge, QuizQuestion, QuizCategory, NotableFigure } from '@/types';

export const getCountries = (): Country[] => countries as Country[];
export const getOrganizations = (): Organization[] => organizations as Organization[];
export const getTimelineEvents = (): TimelineEvent[] =>
  (timelineEvents as TimelineEvent[]).sort((a, b) => a.year - b.year);
export const getComparisonItems = (): ComparisonItem[] => comparisonItems as unknown as ComparisonItem[];
export const getGeopoliticsDimensions = (): GeopoliticsDimension[] => geopoliticsDimensions as GeopoliticsDimension[];
export const getBadges = (): Badge[] => badges as Badge[];
export const getNotableFigures = (): NotableFigure[] => notableFigures as NotableFigure[];
export const getQuizQuestions = async (category: QuizCategory): Promise<QuizQuestion[]> => {
  const mod = await import(`@/data/quiz/${category}.json`);
  return mod.default as QuizQuestion[];
};
export const getOrganizationBySlug = (slug: string): Organization | undefined =>
  (organizations as Organization[]).find(org => org.slug === slug);
export const getCountryById = (id: string): Country | undefined =>
  (countries as Country[]).find(country => country.id === id);
