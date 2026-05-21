'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { QuizResult, UserProgress } from '@/types';
import { QuizResults } from '@/components/quiz/QuizResults';
import { Certificate } from '@/components/quiz/Certificate';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useLocalStorage } from '@/hooks';
import { unlockBadges } from '@/lib/quiz';
import { getBadges } from '@/lib/data';

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

export default function QuizResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [progress, setProgress] = useLocalStorage<UserProgress>(
    'userProgress',
    DEFAULT_PROGRESS
  );

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult');
    if (!stored) {
      router.push('/quiz');
      return;
    }
    try {
      const parsed: QuizResult = JSON.parse(stored);
      const allBadges = getBadges();

      // Read current progress directly from localStorage to get the latest
      // unlocked badges (the hook's state may still be DEFAULT_PROGRESS on
      // first render due to the SSR-safe deferred sync).
      let currentProgress: UserProgress = DEFAULT_PROGRESS;
      try {
        const raw = localStorage.getItem('userProgress');
        if (raw) currentProgress = JSON.parse(raw);
      } catch { /* use default */ }

      const newBadges = unlockBadges(parsed, currentProgress.unlockedBadges, allBadges);
      const resultWithBadges: QuizResult = { ...parsed, badgesUnlocked: newBadges };

      setResult(resultWithBadges);

      setProgress(() => ({
        ...currentProgress,
        totalXP: currentProgress.totalXP + parsed.xpEarned,
        categoryXP: {
          ...currentProgress.categoryXP,
          [parsed.category]: (currentProgress.categoryXP[parsed.category] ?? 0) + parsed.xpEarned,
        },
        unlockedBadges: [...currentProgress.unlockedBadges, ...newBadges],
        quizHistory: [...currentProgress.quizHistory, resultWithBadges],
      }));

      sessionStorage.removeItem('quizResult');
    } catch {
      router.push('/quiz');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Loading results…</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto space-y-6">
        <QuizResults result={result} />
        <div className="px-4 pb-6">
          <Certificate
            category={result.category}
            score={result.score}
            completedAt={result.completedAt}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
