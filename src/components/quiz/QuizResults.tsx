import type { QuizResult } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { Trophy, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import { shouldShowCertificate } from '@/lib/quiz';

interface QuizResultsProps {
  result: QuizResult;
}

export function QuizResults({ result }: QuizResultsProps) {
  const scorePercent = Math.round(result.score * 100);
  const timeSec = Math.round(result.timeTakenMs / 1000);
  const showCert = shouldShowCertificate(result.score);

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-6">
      <div className="text-center space-y-2">
        <Trophy className="size-12 text-primary mx-auto" aria-hidden="true" />
        <h1 className="text-3xl font-bold">Quiz Complete!</h1>
        <p className="text-muted-foreground capitalize">{result.category.replace(/-/g, ' ')}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <Card><CardContent className="pt-4">
          <p className="text-2xl font-bold text-primary">{scorePercent}%</p>
          <p className="text-xs text-muted-foreground">Score</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-2xl font-bold text-amber-500">+{result.xpEarned}</p>
          <p className="text-xs text-muted-foreground">XP Earned</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-2xl font-bold">{timeSec}s</p>
          <p className="text-xs text-muted-foreground">Time Taken</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Results: {result.correctCount}/{result.totalCount} correct</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: result.totalCount }, (_, i) => (
              <span key={i} className={`size-6 rounded flex items-center justify-center ${i < result.correctCount ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} aria-label={i < result.correctCount ? 'Correct' : 'Incorrect'}>
                {i < result.correctCount ? <CheckCircle className="size-4" /> : <XCircle className="size-4" />}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {result.badgesUnlocked.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="size-4 text-amber-500" aria-hidden="true" />Badges Unlocked!</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.badgesUnlocked.map(badge => (
              <BadgeUI key={badge.id} variant="secondary">{badge.name}</BadgeUI>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        {showCert && (
          <Link href={`/quiz/certificate?category=${result.category}&score=${scorePercent}`}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
            View Certificate
          </Link>
        )}
        <Link href="/quiz" className="flex-1 rounded-lg border px-4 py-2.5 text-center text-sm font-medium hover:bg-muted">
          Back to Quiz
        </Link>
      </div>
    </div>
  );
}
export default QuizResults;
