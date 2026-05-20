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
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <h1 className="text-3xl font-bold">Regionalism vs Globalization</h1>
        <p className="text-muted-foreground">How India balances regional cooperation with global integration.</p>
        <ErrorBoundary><ComparisonCards /></ErrorBoundary>
        <ErrorBoundary><ComparisonTable items={items} /></ErrorBoundary>
        <ErrorBoundary><ComparisonCarousel items={items} /></ErrorBoundary>
        <ErrorBoundary><ComparisonSummary /></ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
