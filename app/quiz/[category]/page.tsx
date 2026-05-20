'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { QuizCategory } from '@/types';
import { useQuiz } from '@/hooks';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizQuestion as QuizQuestionComponent } from '@/components/quiz/QuizQuestion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

const VALID_CATEGORIES: QuizCategory[] = [
  'map-geography',
  'regional-organizations',
  'timeline-history',
  'regionalism-globalization',
  'geopolitics',
];

interface Props {
  params: Promise<{ category: string }>;
}

function QuizSession({ category }: { category: QuizCategory }) {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const { session, currentQuestion, submitAnswer, timeRemaining, isComplete, result } =
    useQuiz(category, 30);

  useEffect(() => {
    if (isComplete && result) {
      sessionStorage.setItem('quizResult', JSON.stringify(result));
      router.push('/quiz/results');
    }
  }, [isComplete, result, router]);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    setTimeout(() => {
      submitAnswer(index);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1200);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Loading questions…</p>
      </div>
    );
  }

  if (session.questions.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-muted-foreground">Failed to load questions.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold capitalize">{category.replace(/-/g, ' ')}</h1>
      <QuizProgress
        currentIndex={session.currentIndex}
        total={session.questions.length}
        timeRemaining={timeRemaining}
        secondsPerQuestion={30}
      />
      <QuizQuestionComponent
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswer={handleAnswer}
        showFeedback={showFeedback}
      />
    </div>
  );
}

export default function QuizCategoryPage({ params }: Props) {
  const { category } = use(params);

  if (!VALID_CATEGORIES.includes(category as QuizCategory)) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Invalid quiz category.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ErrorBoundary>
        <QuizSession category={category as QuizCategory} />
      </ErrorBoundary>
    </PageWrapper>
  );
}
