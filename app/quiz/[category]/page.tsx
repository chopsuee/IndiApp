'use client';

import { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { QuizCategory, QuizResult, Badge, UserProgress } from '@/types';
import { useQuiz } from '@/hooks';
import { calculateXP, calculateScore, unlockBadges, shouldShowCertificate } from '@/lib/quiz';
import { getBadges } from '@/lib/data';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { QuizQuestion as QuizQuestionComponent } from '@/components/quiz/QuizQuestion';
import { Certificate } from '@/components/quiz/Certificate';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { ArrowRight, Flag, Trophy, Star, CheckCircle, XCircle } from 'lucide-react';

const VALID_CATEGORIES: QuizCategory[] = [
  'map-geography',
  'regional-organizations',
  'timeline-history',
  'regionalism-globalization',
  'geopolitics',
];

const DEFAULT_PROGRESS: UserProgress = {
  totalXP: 0,
  categoryXP: {
    'map-geography': 0,
    'regional-organizations': 0,
    'timeline-history': 0,
    'regionalism-globalization': 0,
    'geopolitics': 0,
  },
  unlockedBadges: [],
  quizHistory: [],
  displayName: 'Player',
};

interface Props {
  params: Promise<{ category: string }>;
}

function QuizSession({ category }: { category: QuizCategory }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);

  // Track answers locally so we can compute result synchronously
  const answersRef = useRef<(number | null)[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  const { session, currentQuestion, submitAnswer, timeRemaining, isComplete, result } =
    useQuiz(category, 30);

  // Initialise tracking refs when session loads
  useEffect(() => {
    if (session && session.questions.length > 0) {
      startTimeRef.current = session.startTime;
      answersRef.current = new Array(session.questions.length).fill(null);
    }
  }, [session?.questions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // If timer runs out on last question, use hook result
  useEffect(() => {
    if (isComplete && result && !finalResult) {
      // Persist progress
      persistProgress(result);
      setFinalResult(result);
    }
  }, [isComplete, result, finalResult]);

  const persistProgress = (res: QuizResult) => {
    try {
      let currentProgress: UserProgress = DEFAULT_PROGRESS;
      const raw = localStorage.getItem('userProgress');
      if (raw) currentProgress = JSON.parse(raw);

      const allBadges = getBadges();
      const newBadges = unlockBadges(res, currentProgress.unlockedBadges, allBadges);
      const updated: UserProgress = {
        ...currentProgress,
        totalXP: currentProgress.totalXP + res.xpEarned,
        categoryXP: {
          ...currentProgress.categoryXP,
          [res.category]: (currentProgress.categoryXP[res.category] ?? 0) + res.xpEarned,
        },
        unlockedBadges: [...currentProgress.unlockedBadges, ...newBadges],
        quizHistory: [...currentProgress.quizHistory, { ...res, badgesUnlocked: newBadges }],
      };
      localStorage.setItem('userProgress', JSON.stringify(updated));
    } catch { /* ignore */ }
  };

  const handleAnswer = (index: number) => {
    if (showFeedback || finalResult) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (!session || selectedAnswer === null || finalResult) return;

    const isLastQuestion = session.currentIndex === session.questions.length - 1;

    // Record answer locally
    answersRef.current[session.currentIndex] = selectedAnswer;

    if (isLastQuestion) {
      // Compute result synchronously — don't wait for hook state
      const answers = [...answersRef.current];
      const questions = session.questions;
      const endTime = Date.now();

      const correctCount = questions.filter(
        (q, i) => answers[i] === q.correctAnswerIndex
      ).length;
      const totalCount = questions.length;
      const score = calculateScore(answers, questions);
      const xpEarned = calculateXP(questions, answers);

      let existingBadges: Badge[] = [];
      try {
        const raw = localStorage.getItem('userProgress');
        if (raw) existingBadges = JSON.parse(raw).unlockedBadges ?? [];
      } catch { /* ignore */ }

      const allBadges = getBadges();
      const partialResult: QuizResult = {
        category,
        score,
        xpEarned,
        timeTakenMs: endTime - startTimeRef.current,
        correctCount,
        totalCount,
        badgesUnlocked: [],
        completedAt: new Date(endTime).toISOString(),
      };
      const newBadges = unlockBadges(partialResult, existingBadges, allBadges);
      const computed: QuizResult = { ...partialResult, badgesUnlocked: newBadges };

      // Persist to localStorage
      persistProgress(computed);

      // Also call submitAnswer to keep hook state consistent
      submitAnswer(selectedAnswer);

      // Show results inline
      setFinalResult(computed);
    } else {
      submitAnswer(selectedAnswer);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  // ── Results screen ──────────────────────────────────────────────────────
  if (finalResult) {
    const scorePercent = Math.round(finalResult.score * 100);
    const timeSec = Math.round(finalResult.timeTakenMs / 1000);

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <Trophy className="size-12 text-primary mx-auto" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Quiz Complete!</h1>
          <p className="text-muted-foreground capitalize">
            {category.replace(/-/g, ' ')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-primary">{scorePercent}%</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-amber-500">+{finalResult.xpEarned}</p>
              <p className="text-xs text-muted-foreground">XP Earned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{timeSec}s</p>
              <p className="text-xs text-muted-foreground">Time Taken</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {finalResult.correctCount}/{finalResult.totalCount} correct
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: finalResult.totalCount }, (_, i) => (
                <span
                  key={i}
                  className={`size-6 rounded flex items-center justify-center ${
                    i < finalResult.correctCount
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                  aria-label={i < finalResult.correctCount ? 'Correct' : 'Incorrect'}
                >
                  {i < finalResult.correctCount
                    ? <CheckCircle className="size-4" />
                    : <XCircle className="size-4" />}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {finalResult.badgesUnlocked.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="size-4 text-amber-500" aria-hidden="true" />
                Badges Unlocked!
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {finalResult.badgesUnlocked.map((badge) => (
                <BadgeUI key={badge.id} variant="secondary">{badge.name}</BadgeUI>
              ))}
            </CardContent>
          </Card>
        )}

        <Certificate
          category={finalResult.category}
          score={finalResult.score}
          completedAt={finalResult.completedAt}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/quiz"
            className="flex-1 rounded-lg border px-4 py-2.5 text-center text-sm font-medium hover:bg-muted"
          >
            Back to Quiz
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────────
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

  const isLastQuestion = session.currentIndex === session.questions.length - 1;

  // ── Question screen ──────────────────────────────────────────────────────
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

      {showFeedback && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={isLastQuestion ? 'See your results' : 'Next question'}
          >
            {isLastQuestion ? (
              <>
                <Flag className="size-4" aria-hidden="true" />
                See Results
              </>
            ) : (
              <>
                Next
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      )}
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
