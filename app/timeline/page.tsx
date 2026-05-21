import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { TimelineView } from '@/components/timeline/TimelineView';
import { getTimelineEvents } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timeline | India in Asia',
  description: "Explore the historical timeline of India's relationships in Asia",
};

export default function TimelinePage() {
  const events = getTimelineEvents();
  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">Historical Timeline</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Key milestones in India's regional relationships from 1947 to present
          </p>
        </div>
        <ErrorBoundary>
          <TimelineView events={events} />
        </ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
