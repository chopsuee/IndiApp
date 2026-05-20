import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { MapLegend } from '@/components/map/MapLegend';
import { AsiaMapDynamic } from '@/components/map/AsiaMapDynamic';
import { getCountries } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asia Map | India in Asia',
  description: "Explore India's relationships with Asian countries on an interactive map",
};

export default function MapPage() {
  const countries = getCountries();
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-3xl font-bold">Asia Map</h1>
        <p className="text-muted-foreground">Click a country marker to explore India&apos;s relationship with that country.</p>
        <MapLegend />
        <ErrorBoundary>
          <AsiaMapDynamic countries={countries} />
        </ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
