import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { ComparisonCards } from '@/components/comparison/ComparisonCards';
import { ComparisonTable } from '@/components/comparison/ComparisonTable';
import { ComparisonCarousel } from '@/components/comparison/ComparisonCarousel';
import { ComparisonSummary } from '@/components/comparison/ComparisonSummary';
import { getComparisonItems } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regionalism vs Globalization | India in Asia',
  description: "Compare India's approach to regionalism and globalization",
};

export default function ComparisonPage() {
  const items = getComparisonItems();
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">
            Regionalism vs Globalization
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            How India balances regional cooperation with global integration
          </p>
        </div>
        <ErrorBoundary><ComparisonCards /></ErrorBoundary>
        <ErrorBoundary><ComparisonTable items={items} /></ErrorBoundary>
        <ErrorBoundary><ComparisonCarousel items={items} /></ErrorBoundary>
        <ErrorBoundary><ComparisonSummary /></ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
