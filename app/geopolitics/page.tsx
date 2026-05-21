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
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">Geopolitics</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            India's cooperation and competition across key geopolitical dimensions
          </p>
        </div>
        <ErrorBoundary><GeopoliticsStats dimensions={dimensions} /></ErrorBoundary>
        <ErrorBoundary><GeopoliticsChartDynamic dimensions={dimensions} /></ErrorBoundary>
        <ErrorBoundary><RelationshipCards dimensions={dimensions} /></ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
