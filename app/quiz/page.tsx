import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { CategorySelector } from '@/components/quiz/CategorySelector';
import { BadgeGallery } from '@/components/quiz/BadgeGallery';
import { getBadges } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz | India in Asia',
  description: "Test your knowledge about India's role in Asian regionalism",
};

export default function QuizPage() {
  const allBadges = getBadges();
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <h1 className="text-3xl font-bold">Quiz</h1>
        <p className="text-muted-foreground">
          Test your knowledge about India&apos;s role in Asian regionalism.
        </p>
        <ErrorBoundary>
          <CategorySelector />
        </ErrorBoundary>
        <ErrorBoundary>
          <BadgeGallery allBadges={allBadges} />
        </ErrorBoundary>
      </div>
    </PageWrapper>
  );
}
