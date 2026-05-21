import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { OrgGrid } from '@/components/organizations/OrgGrid';
import { getOrganizations } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regional Organizations | India in Asia',
  description: "Explore India's role in regional organizations like BRICS, SAARC, G20, and SCO",
};

export default function OrganizationsPage() {
  const organizations = getOrganizations();
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">Regional Organizations</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            India's participation in key regional and multilateral organizations across Asia
          </p>
        </div>
        <ErrorBoundary>
          <OrgGrid organizations={organizations} />
        </ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
