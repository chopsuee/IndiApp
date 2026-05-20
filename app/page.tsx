import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { FeaturedOrgs } from '@/components/dashboard/FeaturedOrgs';
import { QuickNav } from '@/components/dashboard/QuickNav';
import { InfoGraphic } from '@/components/dashboard/InfoGraphic';
import { getCountries, getOrganizations, getTimelineEvents } from '@/lib/data';

export default function HomePage() {
  const countries = getCountries();
  const organizations = getOrganizations();
  const events = getTimelineEvents();

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 space-y-12 py-4">
        <ErrorBoundary>
          <HeroSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <section aria-label="Key statistics" className="grid grid-cols-3 gap-4">
            <StatCard label="Asian Countries" value={countries.length} />
            <StatCard label="Organizations" value={organizations.length} />
            <StatCard label="Timeline Events" value={events.length} />
          </section>
        </ErrorBoundary>
        <ErrorBoundary>
          <FeaturedOrgs />
        </ErrorBoundary>
        <ErrorBoundary>
          <QuickNav />
        </ErrorBoundary>
        <ErrorBoundary>
          <InfoGraphic />
        </ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
