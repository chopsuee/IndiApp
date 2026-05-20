# Design Document

## India in Asia: Regionalism Explorer

---

## Overview

"India in Asia: Regionalism Explorer" is a mobile-first educational Progressive Web App (PWA) built with Next.js 15 App Router, TypeScript, Tailwind CSS v4, ShadCN UI, and Motion (formerly Framer Motion). The application teaches users about India's geopolitical influence, regional cooperation, and role in Asian affairs through six interactive modules: a Dashboard, an Asia Map, a Regional Organizations browser, a Timeline, a Regionalism vs Globalization Comparison module, and a Cooperation vs Competition Geopolitics module. A gamified Quiz Engine reinforces learning with XP, badges, and leaderboards.

The app is fully offline-capable via a Service Worker and Workbox caching strategy, installable as a PWA, and designed to meet WCAG 2.1 AA accessibility standards. All content data is stored in static JSON files under `src/data/`, enabling offline access without a backend.

### Key Design Decisions

- **Static data layer**: All educational content (countries, organizations, timeline events, quiz questions) lives in typed JSON files. This eliminates backend complexity, enables full offline support, and makes content updates straightforward.
- **Next.js App Router with dynamic imports**: Map and chart libraries (Leaflet, Recharts) are loaded client-side only via `next/dynamic` with `ssr: false` to avoid SSR hydration mismatches and reduce initial bundle size.
- **Motion library**: The project uses the `motion` package (the renamed successor to `framer-motion`) for all animations. The `useReducedMotion` hook from Motion is used globally to respect `prefers-reduced-motion`.
- **ShadCN UI + Recharts charts**: ShadCN's built-in chart components (which wrap Recharts) are used for all data visualizations, keeping the design system consistent.
- **localStorage for persistence**: Quiz progress, XP, badges, and theme preference are persisted in `localStorage` via typed custom hooks, avoiding the need for a database.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser / PWA                        │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Next.js App │   │ Service Worker│   │  localStorage  │  │
│  │  Router      │◄──│  (Workbox)   │   │  (quiz/theme)  │  │
│  │  (SSG pages) │   │  Cache-first │   └────────────────┘  │
│  └──────┬───────┘   └──────────────┘                       │
│         │                                                   │
│  ┌──────▼───────────────────────────────────────────────┐  │
│  │                  Page Components                      │  │
│  │  Dashboard │ Map │ Orgs │ Timeline │ Compare │ Quiz   │  │
│  └──────┬───────────────────────────────────────────────┘  │
│         │                                                   │
│  ┌──────▼───────────────────────────────────────────────┐  │
│  │              Shared Component Library                 │  │
│  │  ShadCN UI │ Layout │ Motion Wrappers │ Charts        │  │
│  └──────┬───────────────────────────────────────────────┘  │
│         │                                                   │
│  ┌──────▼───────────────────────────────────────────────┐  │
│  │                   Data Layer                          │  │
│  │  src/data/*.json  ←→  src/lib/loaders.ts             │  │
│  │  src/types/*.ts (TypeScript interfaces)               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Routing Structure (Next.js App Router)

```
app/
├── layout.tsx              # Root layout: theme provider, bottom nav, PWA meta
├── manifest.ts             # Web App Manifest (Next.js built-in)
├── page.tsx                # / → Dashboard
├── map/
│   └── page.tsx            # /map → Asia Map
├── organizations/
│   ├── page.tsx            # /organizations → Org list
│   └── [slug]/
│       └── page.tsx        # /organizations/[slug] → Org detail
├── timeline/
│   └── page.tsx            # /timeline → Timeline
├── comparison/
│   └── page.tsx            # /comparison → Regionalism vs Globalization
├── geopolitics/
│   └── page.tsx            # /geopolitics → Cooperation vs Competition
└── quiz/
    ├── page.tsx            # /quiz → Quiz category selection
    ├── [category]/
    │   └── page.tsx        # /quiz/[category] → Active quiz session
    └── results/
        └── page.tsx        # /quiz/results → Results screen
```

### PWA Architecture

The PWA layer uses Next.js's built-in manifest support (`app/manifest.ts`) and a custom Service Worker registered from `app/layout.tsx`. The Service Worker is built with Workbox (via `@ducanh2912/next-pwa` or a custom Workbox config) and implements:

- **Cache-first** for static assets (JS, CSS, fonts, icons)
- **Stale-while-revalidate** for page shells and JSON data files
- **Network-first with offline fallback** for map tiles (falls back to static SVG)

```
Service Worker Caching Strategy:
┌─────────────────────────────────────────────────────┐
│  Request Type          │  Strategy                  │
├─────────────────────────────────────────────────────┤
│  Static assets (/_next)│  Cache-first               │
│  JSON data (src/data/) │  Stale-while-revalidate    │
│  Map tiles             │  Network-first + fallback  │
│  Page shells           │  Stale-while-revalidate    │
│  Images                │  Cache-first               │
└─────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Component Hierarchy

```
src/components/
├── layout/
│   ├── RootLayout.tsx          # Wraps all pages; applies theme class
│   ├── BottomNav.tsx           # Mobile sticky bottom navigation
│   ├── TopNav.tsx              # Desktop top navigation bar
│   ├── PageWrapper.tsx         # Motion page transition wrapper
│   └── ThemeToggle.tsx         # Dark/light mode toggle button
├── ui/                         # ShadCN UI components (auto-generated)
│   ├── card.tsx
│   ├── tabs.tsx
│   ├── accordion.tsx
│   ├── carousel.tsx
│   ├── dialog.tsx
│   ├── sheet.tsx
│   ├── toast.tsx
│   ├── progress.tsx
│   ├── badge.tsx
│   └── chart.tsx               # ShadCN chart wrapper (Recharts)
├── dashboard/
│   ├── HeroSection.tsx         # Headline, sub-headline, CTA buttons
│   ├── StatCard.tsx            # Animated counting statistic card
│   ├── FeaturedOrgs.tsx        # 4-card featured organizations grid
│   ├── QuickNav.tsx            # Icon-labeled navigation grid
│   └── InfoGraphic.tsx         # Animated radial/icon infographic
├── map/
│   ├── AsiaMap.tsx             # Dynamic Leaflet map (client-only)
│   ├── MapLegend.tsx           # Color-coded relationship legend
│   ├── CountryDetailPanel.tsx  # Sheet (mobile) / Drawer (desktop)
│   └── FallbackSVGMap.tsx      # Static SVG fallback map
├── organizations/
│   ├── OrgCard.tsx             # Organization summary card
│   ├── OrgGrid.tsx             # Filterable grid of org cards
│   ├── OrgDetail.tsx           # Full organization detail view
│   └── OrgFilter.tsx           # Category filter tabs
├── timeline/
│   ├── TimelineView.tsx        # Container with scroll/swipe logic
│   ├── TimelineCard.tsx        # Expandable milestone card
│   └── TimelineFilter.tsx      # Category filter for timeline
├── comparison/
│   ├── ComparisonCards.tsx     # Side-by-side Regionalism/Globalization cards
│   ├── ComparisonTable.tsx     # Color-coded comparison table
│   ├── ComparisonCarousel.tsx  # Swipeable infographic slides
│   └── ComparisonSummary.tsx   # India's position summary
├── geopolitics/
│   ├── GeopoliticsStats.tsx    # Animated statistic cards
│   ├── RelationshipCards.tsx   # Cooperation vs competition cards
│   └── GeopoliticsChart.tsx    # Radar/bar chart with tooltips
└── quiz/
    ├── CategorySelector.tsx    # Quiz category selection screen
    ├── QuizQuestion.tsx        # Single question with options
    ├── QuizProgress.tsx        # Progress bar + timer
    ├── QuizResults.tsx         # End-of-session results screen
    ├── Certificate.tsx         # Completion certificate (>=80%)
    ├── Leaderboard.tsx         # XP-ranked leaderboard
    └── BadgeGallery.tsx        # Locked/unlocked achievement badges
```

### Custom Hooks

```
src/hooks/
├── useTheme.ts           # Reads/writes theme to localStorage; applies class to <html>
├── useQuiz.ts            # Quiz session state machine (questions, score, XP, timer)
├── useLocalStorage.ts    # Generic typed localStorage get/set with SSR safety
├── useReducedMotion.ts   # Wraps Motion's useReducedMotion for app-wide use
└── useCountUp.ts         # Counting animation hook for statistic cards
```

---

## Data Models

All data models are defined as TypeScript interfaces in `src/types/` and implemented as typed JSON files in `src/data/`.

### Core Types

```typescript
// src/types/country.ts
export interface Country {
  id: string;                          // ISO 3166-1 alpha-2 code
  name: string;
  flag: string;                        // Emoji or URL to flag image
  relationshipCategory: RelationshipCategory;
  tradeSummary: string;
  diplomaticTiesSummary: string;
  allianceMemberships: string[];       // e.g. ["SAARC", "SCO"]
  culturalInfluenceNotes: string;
  cooperationScore: number;            // 0–100
  conflictScore: number;               // 0–100
}

export type RelationshipCategory = 'ally' | 'partner' | 'neutral' | 'rival';

// src/types/organization.ts
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

export interface MemberCountry {
  name: string;
  flag: string;
}

export type OrgCategory = 'Economic' | 'Security' | 'Political';

// src/types/timeline.ts
export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  category: TimelineCategory;
  briefDescription: string;
  detailedDescription: string;
  imageUrl?: string;
  iconName?: string;               // Lucide icon name
}

export type TimelineCategory =
  | 'Economic'
  | 'Diplomatic'
  | 'Technology'
  | 'Space'
  | 'Regional';

// src/types/comparison.ts
export interface ComparisonItem {
  topic: string;
  regionalismValue: ComparisonStrength;
  globalizationValue: ComparisonStrength;
  regionalismDescription: string;
  globalizationDescription: string;
  infographicData?: Record<string, number>;
}

export type ComparisonStrength = 'low' | 'medium' | 'high';

// src/types/geopolitics.ts
export interface GeopoliticsDimension {
  id: string;
  dimension: string;
  cooperationScore: number;        // 0–100
  competitionScore: number;        // 0–100
  cooperationDescription: string;
  competitionDescription: string;
  statisticLabel: string;
  statisticValue: number;
  statisticUnit: string;
  tooltipNote: string;
}

// src/types/quiz.ts
export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];               // Always 4 options
  correctAnswerIndex: number;      // 0–3
  explanation: string;
  xpValue: number;
}

export type QuizCategory =
  | 'map-geography'
  | 'regional-organizations'
  | 'timeline-history'
  | 'regionalism-globalization'
  | 'geopolitics';

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
  score: number;                   // 0.0–1.0
  xpEarned: number;
  timeTakenMs: number;
  correctCount: number;
  totalCount: number;
  badgesUnlocked: Badge[];
  completedAt: string;             // ISO date string
}

// src/types/badge.ts
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;                // Lucide icon name
  unlockCondition: BadgeCondition;
  unlockedAt?: string;             // ISO date string; undefined = locked
}

export interface BadgeCondition {
  type: 'category_complete' | 'perfect_score' | 'xp_threshold' | 'all_categories';
  category?: QuizCategory;
  xpThreshold?: number;
  minScore?: number;
}

// src/types/user.ts
export interface UserProgress {
  totalXP: number;
  categoryXP: Record<QuizCategory, number>;
  unlockedBadges: Badge[];
  quizHistory: QuizResult[];
  displayName: string;
}
```

### Data File Structure

```
src/data/
├── countries.json          # Country[] — Asia map data
├── organizations.json      # Organization[] — BRICS, SAARC, G20, SCO
├── timeline.json           # TimelineEvent[] — 1947 to present
├── comparison.json         # ComparisonItem[] — Regionalism vs Globalization
├── geopolitics.json        # GeopoliticsDimension[] — 6 relationship dimensions
├── quiz/
│   ├── map-geography.json
│   ├── regional-organizations.json
│   ├── timeline-history.json
│   ├── regionalism-globalization.json
│   └── geopolitics.json
└── badges.json             # Badge[] — all achievement badges
```

### Typed Data Loaders

```typescript
// src/lib/data.ts
import countries from '@/data/countries.json';
import organizations from '@/data/organizations.json';
import timelineEvents from '@/data/timeline.json';
import comparisonItems from '@/data/comparison.json';
import geopoliticsDimensions from '@/data/geopolitics.json';
import badges from '@/data/badges.json';
import type { Country, Organization, TimelineEvent, ComparisonItem, GeopoliticsDimension, Badge } from '@/types';

export const getCountries = (): Country[] => countries as Country[];
export const getOrganizations = (): Organization[] => organizations as Organization[];
export const getTimelineEvents = (): TimelineEvent[] =>
  (timelineEvents as TimelineEvent[]).sort((a, b) => a.year - b.year);
export const getComparisonItems = (): ComparisonItem[] => comparisonItems as ComparisonItem[];
export const getGeopoliticsDimensions = (): GeopoliticsDimension[] => geopoliticsDimensions as GeopoliticsDimension[];
export const getBadges = (): Badge[] => badges as Badge[];
export const getQuizQuestions = async (category: QuizCategory): Promise<QuizQuestion[]> => {
  const mod = await import(`@/data/quiz/${category}.json`);
  return mod.default as QuizQuestion[];
};
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

Before writing properties, I reviewed all PROPERTY-classified criteria and eliminated redundancy:

- Properties 2.4 (theme matches OS preference) and 2.5 (theme persists in localStorage) are distinct: one tests the initial read, the other tests the round-trip. Both are kept.
- Properties 5.2 (org card fields) and 6.2 (timeline card fields) are structurally similar but test different data types — both are kept as they validate different interfaces.
- Properties 5.5 and 6.6 (category filtering) are structurally identical patterns applied to different data types. They are kept separate because they test different components and data models.
- Properties 9.5 (XP calculation) and 9.8 (certificate threshold) are distinct business rules — both kept.
- Properties 9.6 (leaderboard ordering) and 6.1 (timeline ordering) are both ordering invariants but on different data — both kept.
- Properties 10.3 (alt attributes) and 10.8 (Next.js Image component) are related but distinct: one tests the attribute, the other tests the component used. They can be combined into one comprehensive image correctness property.

After reflection, 14 distinct properties remain.

---

### Property 1: Theme preference application

*For any* OS color scheme preference value (`'dark'` or `'light'`), when the app initializes without a stored theme override, the applied theme class on the `<html>` element should match the OS preference.

**Validates: Requirements 2.4**

---

### Property 2: Theme persistence round-trip

*For any* theme value (`'dark'` or `'light'`), after the user sets the theme and the page is re-initialized, reading the theme from `localStorage` and applying it should produce the same theme that was originally set.

**Validates: Requirements 2.5**

---

### Property 3: Reduced-motion animation suppression

*For any* animated dashboard component, when `prefers-reduced-motion` is set to `'reduce'`, the Motion variant applied to that component should have a transition duration of 0 or no transition property, ensuring no motion is applied.

**Validates: Requirements 3.7**

---

### Property 4: Country Detail Panel completeness

*For any* country object in the dataset, when the Country Detail Panel is rendered for that country, the rendered output should contain all required fields: country name, flag, relationship category, trade relations summary, diplomatic ties summary, at least one alliance membership (or an empty state), cultural influence notes, and a cooperation/conflict indicator.

**Validates: Requirements 4.2**

---

### Property 5: Organization card field completeness

*For any* organization object in the dataset, rendering its Organization Card should produce output that contains the organization name, acronym, founding year, member count, overview text, and India's role summary.

**Validates: Requirements 5.2**

---

### Property 6: Organization category filter correctness

*For any* category filter value applied to the Regional Organizations Module, all displayed Organization Cards should belong to the selected category, and no cards from other categories should be visible.

**Validates: Requirements 5.5**

---

### Property 7: Timeline chronological ordering

*For any* array of timeline event objects, the order in which they are rendered should be strictly non-decreasing by year — i.e., for any two adjacent rendered cards, the first card's year should be less than or equal to the second card's year.

**Validates: Requirements 6.1**

---

### Property 8: Timeline card field completeness

*For any* timeline event object, rendering its Timeline Card should produce output that contains the event year, title, category tag, and brief description.

**Validates: Requirements 6.2**

---

### Property 9: Timeline category filter correctness

*For any* category filter value applied to the Timeline, all displayed Timeline Cards should have a category tag matching the selected filter, and no cards with other category tags should be visible.

**Validates: Requirements 6.6**

---

### Property 10: Comparison table cell color correctness

*For any* comparison item with a given `ComparisonStrength` value (`'low'`, `'medium'`, or `'high'`), the rendered table cell for that item should have the CSS class corresponding to that strength level, and the class should be distinct for each strength level.

**Validates: Requirements 7.2**

---

### Property 11: Chart tooltip data completeness

*For any* data point in the Geopolitics chart, when the tooltip is triggered for that data point, the rendered tooltip should contain a non-zero numeric value and a non-empty contextual note string.

**Validates: Requirements 8.5**

---

### Property 12: Quiz answer feedback correctness

*For any* quiz question and *for any* answer index selected by the user (0–3), the feedback state should be `'correct'` if and only if the selected index equals the question's `correctAnswerIndex`, and `'incorrect'` otherwise.

**Validates: Requirements 9.3**

---

### Property 13: XP calculation correctness

*For any* quiz session result with N correct answers out of M total questions, the XP earned should equal the sum of `xpValue` for each correctly answered question, plus a bonus XP amount if and only if all M questions were answered correctly (perfect score).

**Validates: Requirements 9.5**

---

### Property 14: Leaderboard descending XP ordering

*For any* array of user progress objects, the leaderboard component should render them in strictly non-increasing order of `totalXP` — i.e., for any two adjacent rendered entries, the first entry's XP should be greater than or equal to the second entry's XP.

**Validates: Requirements 9.6**

---

### Property 15: Quiz completion certificate threshold

*For any* quiz session result, the completion certificate screen should be displayed if and only if the session's score (correct answers / total questions) is greater than or equal to 0.80.

**Validates: Requirements 9.8**

---

### Property 16: Quiz state localStorage round-trip

*For any* `UserProgress` object, serializing it to `localStorage` and then deserializing it should produce an object that is deeply equal to the original — preserving `totalXP`, `categoryXP`, `unlockedBadges`, `quizHistory`, and `displayName`.

**Validates: Requirements 9.9**

---

### Property 17: Image accessibility and component correctness

*For any* raster image rendered in the application, the image should (a) use the Next.js `next/image` `Image` component rather than a raw `<img>` tag, and (b) have a non-empty `alt` attribute string.

**Validates: Requirements 10.3, 10.8**

---

## Error Handling

### Network and Offline Errors

| Scenario | Handling Strategy |
|---|---|
| Map tiles unavailable (offline) | Service Worker returns cached tiles; if not cached, `AsiaMap` catches the tile load error and renders `FallbackSVGMap` |
| JSON data file missing | TypeScript import will fail at build time; data loaders throw typed errors caught by React Error Boundaries |
| localStorage unavailable (private browsing) | `useLocalStorage` wraps all reads/writes in try/catch; falls back to in-memory state |
| Quiz data load failure | `getQuizQuestions` returns empty array; `CategorySelector` shows an error state with retry option |

### Component-Level Error Boundaries

Each major page section is wrapped in a React Error Boundary (`src/components/layout/ErrorBoundary.tsx`) that renders a friendly fallback UI rather than crashing the entire page. The map, chart, and quiz components are the highest-risk areas and each has its own boundary.

### Form and Input Validation

The quiz answer selection is the primary user input. Invalid states (no answer selected, timer expired) are handled by the `useQuiz` hook's state machine, which enforces valid transitions and prevents double-submission.

### PWA Install Prompt

The `beforeinstallprompt` event is captured and stored in a ref. If the browser does not fire this event (e.g., already installed, unsupported browser), the install prompt UI is simply not shown — no error is thrown.

---

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit/example-based tests for specific behaviors with property-based tests for universal correctness guarantees.

**Test runner**: Vitest (compatible with Next.js, fast, TypeScript-native)
**Component testing**: React Testing Library
**Property-based testing**: `fast-check` (TypeScript-native PBT library)
**Accessibility testing**: `axe-core` via `@axe-core/react` or `jest-axe`
**E2E testing**: Playwright (for PWA install, offline behavior, touch gestures)

### Unit and Example-Based Tests

These cover specific rendering checks, interaction behaviors, and edge cases:

- Dashboard renders hero section, stat cards, featured orgs, quick nav, and infographic
- Bottom navigation visible on narrow viewport, replaced by top nav on wide viewport
- Organization card renders and expands on tap
- Timeline card renders and expands on tap
- Quiz session: question display, answer selection, progress bar, timer
- Quiz results screen: score, XP, time, breakdown, badge display
- Toast notification appears on badge unlock
- Country Detail Panel renders as Sheet on mobile, Drawer on desktop
- Fallback SVG map renders when Leaflet tiles fail
- Comparison carousel renders correct number of slides
- Certificate screen appears for >=80% score, hidden for <80%

### Property-Based Tests

Each property-based test uses `fast-check` with a minimum of 100 iterations. Tests are tagged with the feature and property number.

```typescript
// Example: Property 12 — Quiz answer feedback correctness
// Feature: india-asia-regionalism-explorer, Property 12: Quiz answer feedback correctness
import * as fc from 'fast-check';
import { getAnswerFeedback } from '@/lib/quiz';

test('Property 12: answer feedback is correct iff selected index matches correctAnswerIndex', () => {
  fc.assert(
    fc.property(
      fc.record({
        correctAnswerIndex: fc.integer({ min: 0, max: 3 }),
        selectedIndex: fc.integer({ min: 0, max: 3 }),
      }),
      ({ correctAnswerIndex, selectedIndex }) => {
        const feedback = getAnswerFeedback(correctAnswerIndex, selectedIndex);
        if (selectedIndex === correctAnswerIndex) {
          return feedback === 'correct';
        } else {
          return feedback === 'incorrect';
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property tests to implement** (one test per property):

| Property | Test File | Key Arbitraries |
|---|---|---|
| 1: Theme preference application | `useTheme.test.ts` | `fc.constantFrom('dark', 'light')` |
| 2: Theme persistence round-trip | `useLocalStorage.test.ts` | `fc.constantFrom('dark', 'light')` |
| 3: Reduced-motion suppression | `MotionWrapper.test.tsx` | `fc.boolean()` (reduced motion on/off) |
| 4: Country Detail Panel completeness | `CountryDetailPanel.test.tsx` | `fc.record(...)` for Country shape |
| 5: Org card field completeness | `OrgCard.test.tsx` | `fc.record(...)` for Organization shape |
| 6: Org category filter correctness | `OrgGrid.test.tsx` | `fc.constantFrom('Economic', 'Security', 'Political')` |
| 7: Timeline chronological ordering | `data.test.ts` | `fc.array(fc.record({ year: fc.integer(...) }))` |
| 8: Timeline card field completeness | `TimelineCard.test.tsx` | `fc.record(...)` for TimelineEvent shape |
| 9: Timeline category filter | `TimelineView.test.tsx` | `fc.constantFrom(TimelineCategory values)` |
| 10: Comparison table cell color | `ComparisonTable.test.tsx` | `fc.constantFrom('low', 'medium', 'high')` |
| 11: Chart tooltip completeness | `GeopoliticsChart.test.tsx` | `fc.record(...)` for GeopoliticsDimension shape |
| 12: Quiz answer feedback | `quiz.test.ts` | `fc.integer({ min: 0, max: 3 })` × 2 |
| 13: XP calculation | `quiz.test.ts` | `fc.array(fc.record({ xpValue, isCorrect }))` |
| 14: Leaderboard ordering | `Leaderboard.test.tsx` | `fc.array(fc.record({ totalXP: fc.nat() }))` |
| 15: Certificate threshold | `Certificate.test.tsx` | `fc.float({ min: 0, max: 1 })` |
| 16: Quiz state localStorage round-trip | `useLocalStorage.test.ts` | `fc.record(...)` for UserProgress shape |
| 17: Image alt + component | `ImageAudit.test.tsx` | Render each page, audit all images |

### Accessibility Tests

- `axe-core` run against each page's rendered output in Vitest
- Keyboard navigation verified for Bottom Nav, Quiz options, Org cards, Timeline cards
- Focus management tested for Country Detail Panel open/close cycle

### E2E Tests (Playwright)

- PWA install prompt appears on first visit
- Offline mode: navigate to cached pages without network
- Touch gestures: pinch-to-zoom on map, swipe on timeline and carousel
- Full quiz session: start → answer all → view results → badge toast

### Performance

- Lighthouse CI run in GitHub Actions on each PR targeting the Home page
- Bundle analysis via `@next/bundle-analyzer` to verify dynamic imports for Leaflet and Recharts
- Target: Lighthouse Performance ≥ 80, Accessibility ≥ 90 on mobile emulation
