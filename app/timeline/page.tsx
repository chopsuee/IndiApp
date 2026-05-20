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
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-3xl font-bold">Historical Timeline</h1>
        <p className="text-muted-foreground">Key milestones in India&apos;s regional relationships from 1947 to present.</p>
        <ErrorBoundary>
          <TimelineView events={events} />
        </ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
