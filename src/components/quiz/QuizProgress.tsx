import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface QuizProgressProps {
  currentIndex: number;
  total: number;
  timeRemaining: number;
  secondsPerQuestion?: number;
}

export function QuizProgress({ currentIndex, total, timeRemaining, secondsPerQuestion = 30 }: QuizProgressProps) {
  const progressPercent = total > 0 ? (currentIndex / total) * 100 : 0;
  const timerPercent = secondsPerQuestion > 0 ? (timeRemaining / secondsPerQuestion) * 100 : 0;
  const isLowTime = timeRemaining <= 10;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Question {currentIndex + 1} of {total}</span>
        <span className={`flex items-center gap-1 font-medium tabular-nums ${isLowTime ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
          <Clock className="size-3.5" aria-hidden="true" />
          {timeRemaining}s
        </span>
      </div>
      <Progress
        value={progressPercent}
        aria-label={`Question ${currentIndex + 1} of ${total}`}
      />
      <Progress
        value={timerPercent}
        className={isLowTime ? '[&_[data-slot=progress-indicator]]:bg-red-500' : '[&_[data-slot=progress-indicator]]:bg-amber-500'}
        aria-label={`${timeRemaining} seconds remaining`}
      />
    </div>
  );
}
export default QuizProgress;
