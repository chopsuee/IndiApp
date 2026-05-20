# Implementation Plan: India in Asia — Regionalism Explorer

## Overview

This plan converts the design document into incremental coding tasks for a Next.js 15 App Router PWA built with TypeScript, Tailwind CSS v4, ShadCN UI, and Motion. Tasks are ordered so each step builds on the previous one, ending with full integration. All content data lives in static JSON files; quiz progress and theme are persisted in `localStorage`. Property-based tests use `fast-check`; component tests use Vitest + React Testing Library.

---

## Tasks

- [x] 1. Project foundation — dependencies, configuration, and TypeScript types
  - Install and configure all required dependencies: `motion`, `leaflet`, `@types/leaflet`, `recharts`, `fast-check`, `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/user-event`, `jest-axe`, `@axe-core/react`, `@ducanh2912/next-pwa` (or equivalent Workbox integration), and ShadCN UI CLI
  - Run `npx shadcn@latest init` and add required ShadCN components: `card`, `tabs`, `accordion`, `carousel`, `dialog`, `sheet`, `toast`, `progress`, `badge`, `chart`
  - Configure `vitest.config.ts` with jsdom environment, path aliases matching `tsconfig.json`, and `@testing-library/jest-dom` setup file
  - Create `src/types/country.ts`, `src/types/organization.ts`, `src/types/timeline.ts`, `src/types/comparison.ts`, `src/types/geopolitics.ts`, `src/types/quiz.ts`, `src/types/badge.ts`, `src/types/user.ts` with all interfaces and union types exactly as specified in the design document
  - Create `src/types/index.ts` barrel file re-exporting all types
  - _Requirements: 8.3_

  - [ ]* 1.1 Write property test for TypeScript type round-trip (UserProgress localStorage)
    - **Property 16: Quiz state localStorage round-trip**
    - **Validates: Requirements 9.9**

- [x] 2. Static data layer — JSON files and typed loaders
  - [x] 2.1 Create seed JSON data files
    - Create `src/data/countries.json` with at least 15 Asian countries, each conforming to the `Country` interface (id, name, flag, relationshipCategory, tradeSummary, diplomaticTiesSummary, allianceMemberships, culturalInfluenceNotes, cooperationScore 0–100, conflictScore 0–100)
    - Create `src/data/organizations.json` with BRICS, SAARC, G20, SCO, ASEAN+India, and at least two others, each conforming to `Organization`
    - Create `src/data/timeline.json` with at least 20 events from 1947 to present, each conforming to `TimelineEvent`
    - Create `src/data/comparison.json` with at least 6 `ComparisonItem` entries covering trade, security, diplomacy, connectivity, cultural ties, and technology
    - Create `src/data/geopolitics.json` with 6 `GeopoliticsDimension` entries
    - Create `src/data/badges.json` with at least 8 `Badge` entries covering all `BadgeCondition` types
    - Create `src/data/quiz/map-geography.json`, `regional-organizations.json`, `timeline-history.json`, `regionalism-globalization.json`, and `geopolitics.json`, each with at least 10 `QuizQuestion` entries (4 options, correctAnswerIndex 0–3, xpValue, explanation)
    - _Requirements: 4.2, 5.2, 6.1, 6.2, 7.2, 8.5, 9.3, 9.5_

  - [x] 2.2 Implement typed data loaders
    - Create `src/lib/data.ts` with `getCountries`, `getOrganizations`, `getTimelineEvents` (sorted ascending by year), `getComparisonItems`, `getGeopoliticsDimensions`, `getBadges`, and `getQuizQuestions` (dynamic import) exactly as specified in the design
    - Add `getOrganizationBySlug(slug: string): Organization | undefined` helper
    - Add `getCountryById(id: string): Country | undefined` helper
    - _Requirements: 5.5, 6.1, 8.3_

  - [ ]* 2.3 Write property test for timeline chronological ordering
    - **Property 7: Timeline chronological ordering**
    - **Validates: Requirements 6.1**

- [x] 3. Custom hooks
  - [x] 3.1 Implement `useLocalStorage` hook
    - Create `src/hooks/useLocalStorage.ts` — generic typed hook with SSR safety (check `typeof window !== 'undefined'`), wrapping all reads/writes in try/catch, falling back to in-memory state when `localStorage` is unavailable
    - _Requirements: 9.9_

  - [ ]* 3.2 Write property test for useLocalStorage round-trip
    - **Property 16: Quiz state localStorage round-trip**
    - **Validates: Requirements 9.9**

  - [x] 3.3 Implement `useTheme` hook
    - Create `src/hooks/useTheme.ts` — reads stored theme from `localStorage` via `useLocalStorage`; falls back to `window.matchMedia('(prefers-color-scheme: dark)')` when no stored value exists; applies `'dark'` or `'light'` class to `document.documentElement`; exposes `theme` and `toggleTheme`
    - _Requirements: 2.4, 2.5_

  - [ ]* 3.4 Write property tests for theme hooks
    - **Property 1: Theme preference application** — `fc.constantFrom('dark', 'light')`
    - **Property 2: Theme persistence round-trip** — `fc.constantFrom('dark', 'light')`
    - **Validates: Requirements 2.4, 2.5**

  - [x] 3.5 Implement `useReducedMotion` and `useCountUp` hooks
    - Create `src/hooks/useReducedMotion.ts` — wraps Motion's `useReducedMotion` hook for app-wide use
    - Create `src/hooks/useCountUp.ts` — animates a number from 0 to a target value over a configurable duration; returns 0 immediately when reduced motion is active
    - _Requirements: 3.7_

  - [x] 3.6 Implement `useQuiz` hook
    - Create `src/hooks/useQuiz.ts` — state machine managing: session initialisation (load questions for category), answer submission (record answer, advance index), timer countdown (configurable seconds per question), session completion (compute score, XP, badges), and reset
    - XP calculation: sum `xpValue` for each correct answer; add bonus XP (e.g., 50 XP) if and only if all questions are answered correctly
    - Expose: `session`, `currentQuestion`, `submitAnswer(index)`, `timeRemaining`, `isComplete`, `result`
    - _Requirements: 9.3, 9.5, 9.8_

  - [x] 3.7 Create `src/hooks/index.ts` barrel file
    - _Requirements: (all hook consumers)_

- [ ] 4. Root layout, navigation, and PWA shell
  - [ ] 4.1 Implement root layout and theme provider
    - Update `app/layout.tsx` to apply theme class from `useTheme`, register the Service Worker, include PWA meta tags (`theme-color`, `apple-mobile-web-app-capable`, viewport), and wrap children in an error boundary
    - Create `app/manifest.ts` using Next.js built-in manifest API with `name`, `short_name`, `start_url`, `display: 'standalone'`, `background_color`, `theme_color`, and icon entries
    - Create `src/components/layout/ErrorBoundary.tsx` — class component rendering a friendly fallback UI with a "Return to home" link
    - _Requirements: 2.4, 2.5, 10.1_

  - [x] 4.2 Implement navigation components
    - Create `src/components/layout/BottomNav.tsx` — sticky bottom bar visible on viewports < 768px; renders icon + label links for Dashboard, Map, Organizations, Timeline, Comparison, Geopolitics, Quiz; highlights active route; all links have ARIA labels
    - Create `src/components/layout/TopNav.tsx` — horizontal nav bar visible on viewports ≥ 768px; same links as BottomNav; includes `ThemeToggle`; collapses to hamburger menu at 768px breakpoint
    - Create `src/components/layout/ThemeToggle.tsx` — button toggling dark/light mode via `useTheme`; uses Lucide `Sun`/`Moon` icons; has ARIA label
    - Create `src/components/layout/PageWrapper.tsx` — wraps page content in a Motion `<motion.div>` with fade-in/slide-up variants; skips animation when `useReducedMotion` returns true
    - _Requirements: 2.1, 2.2, 2.3, 3.7, 7.2, 7.5_

  - [x] 4.3 Configure PWA Service Worker
    - Configure `@ducanh2912/next-pwa` (or equivalent) in `next.config.ts` with Workbox caching strategies: cache-first for `/_next/**` and images, stale-while-revalidate for page shells and `src/data/**` JSON, network-first with offline fallback for map tiles
    - _Requirements: 10.1, 10.2_

  - [ ]* 4.4 Write property test for reduced-motion animation suppression
    - **Property 3: Reduced-motion animation suppression**
    - **Validates: Requirements 3.7**

- [ ] 5. Dashboard module
  - [ ] 5.1 Implement Dashboard components
    - Create `src/components/dashboard/HeroSection.tsx` — headline "India in Asia", sub-headline, and CTA buttons linking to Map and Quiz; uses Motion entrance animation respecting `useReducedMotion`
    - Create `src/components/dashboard/StatCard.tsx` — displays a statistic label and animated count-up number using `useCountUp`; accepts `label`, `value`, `unit` props
    - Create `src/components/dashboard/FeaturedOrgs.tsx` — renders a 2×2 grid of `OrgCard` components for the four featured organizations (BRICS, SAARC, G20, SCO)
    - Create `src/components/dashboard/QuickNav.tsx` — icon-labeled grid of navigation tiles for all six modules
    - Create `src/components/dashboard/InfoGraphic.tsx` — animated radial or icon-based infographic illustrating India's regional reach; uses Motion and respects reduced motion
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 5.2 Implement Dashboard page
    - Update `app/page.tsx` to compose `HeroSection`, three `StatCard` instances (e.g., countries, organizations, timeline events), `FeaturedOrgs`, `QuickNav`, and `InfoGraphic` inside `PageWrapper`
    - Wrap each section in `ErrorBoundary`
    - _Requirements: 3.1–3.6_

- [x] 6. Asia Map module
  - [x] 6.1 Implement map components
    - Create `src/components/map/FallbackSVGMap.tsx` — static SVG map of Asia with country outlines; used when Leaflet tiles fail or offline; each country region is colour-coded by `relationshipCategory`
    - Create `src/components/map/MapLegend.tsx` — colour-coded legend for `RelationshipCategory` values (ally, partner, neutral, rival); uses both colour and text label (not colour alone) per WCAG
    - Create `src/components/map/CountryDetailPanel.tsx` — renders as ShadCN `Sheet` on mobile (< 768px) and `Drawer` on desktop; displays all `Country` fields: name, flag, relationship category, trade summary, diplomatic ties summary, alliance memberships (or empty state), cultural influence notes, cooperation/conflict scores; has accessible close button
    - Create `src/components/map/AsiaMap.tsx` — Leaflet map loaded via `next/dynamic` with `ssr: false`; markers coloured by `relationshipCategory`; clicking a marker opens `CountryDetailPanel`; catches tile load errors and renders `FallbackSVGMap`; wrapped in its own `ErrorBoundary`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 7.6_

  - [x] 6.2 Implement Map page
    - Create `app/map/page.tsx` composing `AsiaMap`, `MapLegend`, and `CountryDetailPanel` inside `PageWrapper`; load countries via `getCountries()`
    - _Requirements: 4.1–4.5_

  - [ ]* 6.3 Write property test for Country Detail Panel completeness
    - **Property 4: Country Detail Panel completeness**
    - **Validates: Requirements 4.2**

- [x] 7. Regional Organizations module
  - [x] 7.1 Implement Organizations components
    - Create `src/components/organizations/OrgFilter.tsx` — ShadCN `Tabs` component with tabs for "All", "Economic", "Security", "Political"; emits selected category via callback
    - Create `src/components/organizations/OrgCard.tsx` — ShadCN `Card` displaying organization name, acronym, founding year, member count, overview text, and India's role summary; expandable via ShadCN `Accordion` to show objectives and member countries; keyboard accessible
    - Create `src/components/organizations/OrgGrid.tsx` — renders a filterable grid of `OrgCard` components; accepts `organizations` and `activeCategory` props; filters client-side
    - Create `src/components/organizations/OrgDetail.tsx` — full detail view for a single organization: all `Organization` fields, member country flags, India's contributions list, Asian regionalism impact, and links back to the org list
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 7.2 Implement Organizations pages
    - Create `app/organizations/page.tsx` composing `OrgFilter` and `OrgGrid` inside `PageWrapper`; load organizations via `getOrganizations()`
    - Create `app/organizations/[slug]/page.tsx` rendering `OrgDetail` for the matched organization; return 404 if slug not found; generate static params via `generateStaticParams`
    - _Requirements: 5.1–5.5_

  - [ ]* 7.3 Write property tests for Organizations module
    - **Property 5: Organization card field completeness** — `fc.record(...)` for Organization shape
    - **Property 6: Organization category filter correctness** — `fc.constantFrom('Economic', 'Security', 'Political')`
    - **Validates: Requirements 5.2, 5.5**

- [x] 8. Timeline module
  - [x] 8.1 Implement Timeline components
    - Create `src/components/timeline/TimelineFilter.tsx` — ShadCN `Tabs` for "All", "Economic", "Diplomatic", "Technology", "Space", "Regional"; emits selected category
    - Create `src/components/timeline/TimelineCard.tsx` — displays event year, title, category badge, brief description; expands via ShadCN `Accordion` to show detailed description and optional image; uses Motion stagger animation respecting reduced motion
    - Create `src/components/timeline/TimelineView.tsx` — vertical scrollable timeline; renders `TimelineCard` list filtered by active category; events always rendered in ascending year order (uses `getTimelineEvents()` which sorts ascending)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 8.2 Implement Timeline page
    - Create `app/timeline/page.tsx` composing `TimelineFilter` and `TimelineView` inside `PageWrapper`; load events via `getTimelineEvents()`
    - _Requirements: 6.1–6.6_

  - [ ]* 8.3 Write property tests for Timeline module
    - **Property 7: Timeline chronological ordering** (also covered in task 2.3 — verify here at component level)
    - **Property 8: Timeline card field completeness** — `fc.record(...)` for TimelineEvent shape
    - **Property 9: Timeline category filter correctness** — `fc.constantFrom(TimelineCategory values)`
    - **Validates: Requirements 6.1, 6.2, 6.6**

- [x] 9. Regionalism vs Globalization Comparison module
  - [x] 9.1 Implement Comparison components
    - Create `src/components/comparison/ComparisonCards.tsx` — side-by-side ShadCN `Card` pair for Regionalism and Globalization; each card shows title, icon, and a bullet list of key characteristics
    - Create `src/components/comparison/ComparisonTable.tsx` — table with rows for each `ComparisonItem`; cells colour-coded by `ComparisonStrength` (`low` → red/muted, `medium` → amber, `high` → green); colour is supplemented by text label and icon (not colour alone)
    - Create `src/components/comparison/ComparisonCarousel.tsx` — ShadCN `Carousel` of infographic slides, one per `ComparisonItem`; swipeable on touch devices; each slide shows topic, regionalism value, globalization value, and descriptions
    - Create `src/components/comparison/ComparisonSummary.tsx` — India's strategic position summary card with key takeaways
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 9.2 Implement Comparison page
    - Create `app/comparison/page.tsx` composing `ComparisonCards`, `ComparisonTable`, `ComparisonCarousel`, and `ComparisonSummary` inside `PageWrapper`; load data via `getComparisonItems()`
    - _Requirements: 7.1–7.6_

  - [ ]* 9.3 Write property test for Comparison table cell color correctness
    - **Property 10: Comparison table cell color correctness**
    - **Validates: Requirements 7.2**

- [x] 10. Geopolitics module
  - [x] 10.1 Implement Geopolitics components
    - Create `src/components/geopolitics/GeopoliticsStats.tsx` — grid of animated `StatCard`-style cards, one per `GeopoliticsDimension`, showing `statisticLabel`, `statisticValue`, and `statisticUnit` with count-up animation
    - Create `src/components/geopolitics/RelationshipCards.tsx` — for each dimension, a two-column card showing cooperation description vs competition description with colour-coded headers
    - Create `src/components/geopolitics/GeopoliticsChart.tsx` — ShadCN chart (Recharts radar or bar) loaded via `next/dynamic` with `ssr: false`; plots `cooperationScore` vs `competitionScore` for each dimension; tooltips show `tooltipNote` and numeric value; wrapped in `ErrorBoundary`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 10.2 Implement Geopolitics page
    - Create `app/geopolitics/page.tsx` composing `GeopoliticsStats`, `RelationshipCards`, and `GeopoliticsChart` inside `PageWrapper`; load data via `getGeopoliticsDimensions()`
    - _Requirements: 8.1–8.5_

  - [ ]* 10.3 Write property test for chart tooltip data completeness
    - **Property 11: Chart tooltip data completeness**
    - **Validates: Requirements 8.5**

- [x] 11. Quiz Engine — core logic and utility functions
  - [x] 11.1 Implement quiz utility functions
    - Create `src/lib/quiz.ts` with:
      - `getAnswerFeedback(correctAnswerIndex: number, selectedIndex: number): 'correct' | 'incorrect'`
      - `calculateXP(questions: QuizQuestion[], answers: (number | null)[]): number` — sums `xpValue` for correct answers; adds bonus XP (50) if and only if all answers are correct
      - `calculateScore(answers: (number | null)[], questions: QuizQuestion[]): number` — returns correct / total as 0.0–1.0
      - `shouldShowCertificate(score: number): boolean` — returns true iff score >= 0.80
      - `sortLeaderboard(users: UserProgress[]): UserProgress[]` — returns array sorted by `totalXP` descending (stable sort)
      - `unlockBadges(result: QuizResult, existing: Badge[], allBadges: Badge[]): Badge[]` — evaluates all `BadgeCondition` types and returns newly unlocked badges
    - _Requirements: 9.3, 9.5, 9.6, 9.8_

  - [ ]* 11.2 Write property tests for quiz utility functions
    - **Property 12: Quiz answer feedback correctness** — `fc.integer({ min: 0, max: 3 })` × 2
    - **Property 13: XP calculation correctness** — `fc.array(fc.record({ xpValue: fc.nat(), isCorrect: fc.boolean() }))`
    - **Property 14: Leaderboard descending XP ordering** — `fc.array(fc.record({ totalXP: fc.nat() }))`
    - **Property 15: Quiz completion certificate threshold** — `fc.float({ min: 0, max: 1 })`
    - **Validates: Requirements 9.3, 9.5, 9.6, 9.8**

- [ ] 12. Quiz Engine — UI components
  - [x] 12.1 Implement Quiz UI components
    - Create `src/components/quiz/CategorySelector.tsx` — grid of category cards (one per `QuizCategory`); each shows category name, icon, and best score from `UserProgress`; navigates to `/quiz/[category]` on selection; shows error state with retry if questions fail to load
    - Create `src/components/quiz/QuizProgress.tsx` — ShadCN `Progress` bar showing current question index / total; countdown timer display; accessible via ARIA `progressbar` role
    - Create `src/components/quiz/QuizQuestion.tsx` — renders question text and four answer option buttons; highlights selected answer; shows correct/incorrect feedback after submission with colour + icon (not colour alone); keyboard accessible (arrow keys + Enter)
    - Create `src/components/quiz/QuizResults.tsx` — end-of-session screen showing score percentage, XP earned, time taken, per-question breakdown, and unlocked badges; links to certificate if score >= 80%
    - Create `src/components/quiz/Certificate.tsx` — completion certificate rendered only when `shouldShowCertificate(score)` is true; shows category, score, date, and a congratulatory message
    - Create `src/components/quiz/Leaderboard.tsx` — renders `UserProgress` entries sorted by `sortLeaderboard`; each row shows rank, display name, and total XP; current user row highlighted
    - Create `src/components/quiz/BadgeGallery.tsx` — grid of all badges from `getBadges()`; unlocked badges shown in full colour with unlock date; locked badges shown greyed out with unlock condition text
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

  - [ ] 12.2 Implement Quiz pages
    - Create `app/quiz/page.tsx` rendering `CategorySelector` and `BadgeGallery` inside `PageWrapper`
    - Create `app/quiz/[category]/page.tsx` — loads questions via `getQuizQuestions(category)`, initialises `useQuiz` session, renders `QuizProgress` and `QuizQuestion`; on completion navigates to `/quiz/results` passing result via `sessionStorage`
    - Create `app/quiz/results/page.tsx` — reads result from `sessionStorage`, renders `QuizResults` and conditionally `Certificate`; fires ShadCN `Toast` for each newly unlocked badge; persists updated `UserProgress` to `localStorage` via `useLocalStorage`
    - _Requirements: 9.1–9.9_

  - [ ]* 12.3 Write property tests for Quiz UI components
    - **Property 15: Quiz completion certificate threshold** — render `Certificate` with `fc.float({ min: 0, max: 1 })` score
    - **Property 14: Leaderboard descending XP ordering** — render `Leaderboard` with `fc.array(fc.record({ totalXP: fc.nat() }))`
    - **Validates: Requirements 9.6, 9.8**

- [~] 13. Checkpoint — core modules complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Accessibility audit and WCAG compliance
  - [~] 14.1 Add ARIA labels and keyboard navigation
    - Audit all interactive elements (nav links, buttons, search inputs, filter tabs, quiz options, map markers, carousel controls) and add missing `aria-label`, `aria-describedby`, `role`, and `tabIndex` attributes
    - Verify visible focus indicators are present on all interactive elements in both light and dark themes
    - Ensure no information is conveyed by colour alone: add text labels or icons alongside all colour-coded elements (map legend, comparison table, quiz feedback, relationship cards)
    - _Requirements: 7.3, 7.4, 7.5, 7.6_

  - [ ]* 14.2 Write axe-core accessibility tests
    - Run `axe-core` against the rendered output of each page (Dashboard, Map, Organizations, Timeline, Comparison, Geopolitics, Quiz category selector, Quiz session, Quiz results) in Vitest
    - Assert zero violations at WCAG 2.1 AA level
    - _Requirements: 7.3, 7.4, 7.5, 7.6_

  - [ ]* 14.3 Write property test for image accessibility
    - **Property 17: Image accessibility and component correctness** — render each page and assert all `<img>` elements use `next/image` and have non-empty `alt` attributes
    - **Validates: Requirements 10.3, 10.8**

- [ ] 15. PWA offline capability and install prompt
  - [~] 15.1 Implement offline fallback page
    - Create `app/offline/page.tsx` — static fallback page served by the Service Worker when the user is offline and the requested page is not cached; shows a friendly message and links to cached pages
    - _Requirements: 10.1, 10.2_

  - [~] 15.2 Implement PWA install prompt
    - Create `src/components/layout/InstallPrompt.tsx` — captures `beforeinstallprompt` event in a ref; renders an install banner with "Add to Home Screen" button when the event fires; silently hides if the event never fires (already installed or unsupported browser)
    - Add `InstallPrompt` to `app/layout.tsx`
    - _Requirements: 10.1_

- [ ] 16. Performance optimisation and bundle analysis
  - [~] 16.1 Verify dynamic imports and bundle size
    - Confirm `AsiaMap.tsx` and `GeopoliticsChart.tsx` are loaded via `next/dynamic` with `ssr: false` and `loading` prop
    - Add `@next/bundle-analyzer` to `next.config.ts` behind `ANALYZE=true` env flag
    - Run `ANALYZE=true npm run build` and verify Leaflet and Recharts chunks are not included in the initial JS bundle
    - _Requirements: 10.4, 10.5_

  - [~] 16.2 Add Next.js Image component to all raster images
    - Replace any raw `<img>` tags with `next/image` `Image` component; ensure all images have non-empty `alt` attributes; add `sizes` prop for responsive images
    - _Requirements: 10.3, 10.8_

- [ ] 17. Final integration and wiring
  - [~] 17.1 Wire all modules into root layout
    - Verify `BottomNav` and `TopNav` correctly highlight the active route for all seven routes (`/`, `/map`, `/organizations`, `/timeline`, `/comparison`, `/geopolitics`, `/quiz`)
    - Verify `PageWrapper` transition animations fire on route changes and are suppressed when `useReducedMotion` is true
    - Verify `ErrorBoundary` wraps each major page section and renders fallback UI on error
    - Verify `InstallPrompt` appears on first visit and is hidden after install
    - _Requirements: 2.1, 2.2, 2.3, 3.7, 10.1_

  - [~] 17.2 End-to-end integration verification via automated tests
    - Write Vitest integration tests covering: full quiz session (start → answer all → view results → badge toast → persist XP), theme toggle (dark → light → dark, verify localStorage and `<html>` class), and organization filter (select category → verify only matching cards rendered)
    - _Requirements: 2.4, 2.5, 5.5, 9.1–9.9_

- [~] 18. Final checkpoint — all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property-based tests use `fast-check` with a minimum of 100 iterations (`numRuns: 100`)
- Unit and property tests are complementary — both are included where applicable
- Checkpoints at tasks 13 and 18 ensure incremental validation
- The design document's Correctness Properties section defines 17 properties; all are covered by property test sub-tasks above
- Dynamic imports (`next/dynamic` with `ssr: false`) are mandatory for Leaflet and Recharts to avoid SSR hydration mismatches
- All `localStorage` access must be guarded with `typeof window !== 'undefined'` for SSR safety

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1", "3.3", "3.5"] },
    { "id": 2, "tasks": ["2.2", "2.3", "3.2", "3.4", "3.6", "3.7"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3", "11.1"] },
    { "id": 4, "tasks": ["4.4", "5.1", "6.1", "7.1", "8.1", "9.1", "10.1", "11.2"] },
    { "id": 5, "tasks": ["5.2", "6.2", "7.2", "8.2", "9.2", "10.2", "12.1"] },
    { "id": 6, "tasks": ["6.3", "7.3", "8.3", "9.3", "10.3", "12.2"] },
    { "id": 7, "tasks": ["12.3", "14.1", "15.1", "15.2"] },
    { "id": 8, "tasks": ["14.2", "14.3", "16.1", "16.2"] },
    { "id": 9, "tasks": ["17.1", "17.2"] }
  ]
}
```
