import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { GeopoliticsStats } from '@/components/geopolitics/GeopoliticsStats';
import { RelationshipCards } from '@/components/geopolitics/RelationshipCards';
import { GeopoliticsChartDynamic } from '@/components/geopolitics/GeopoliticsChartDynamic';
import { getGeopoliticsDimensions } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Geopolitics | India in Asia',
  description: "Explore India's geopolitical cooperation and competition across Asia",
};

export default function GeopoliticsPage() {
  const dimensions = getGeopoliticsDimensions();
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <h1 className="text-3xl font-bold">Geopolitics</h1>
        <p className="text-muted-foreground">India&apos;s cooperation and competition across key geopolitical dimensions.</p>
        <ErrorBoundary><GeopoliticsStats dimensions={dimensions} /></ErrorBoundary>
        <ErrorBoundary><GeopoliticsChartDynamic dimensions={dimensions} /></ErrorBoundary>
        <ErrorBoundary><RelationshipCards dimensions={dimensions} /></ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
