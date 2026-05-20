'use client';
import type { QuizQuestion as QuizQuestionType } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
  showFeedback: boolean;
}

export function QuizQuestion({ question, selectedAnswer, onAnswer, showFeedback }: QuizQuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium leading-relaxed">{question.question}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Answer options">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswerIndex;
          let feedbackClass = '';
          if (showFeedback && isCorrect) {
            feedbackClass = 'border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200';
          } else if (showFeedback && isSelected && !isCorrect) {
            feedbackClass = 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200';
          }
          return (
            <button
              key={index}
              onClick={() => !showFeedback && onAnswer(index)}
              disabled={showFeedback}
              aria-pressed={isSelected}
              aria-label={`Option ${index + 1}: ${option}${showFeedback && isCorrect ? ' (correct)' : ''}${showFeedback && isSelected && !isCorrect ? ' (incorrect)' : ''}`}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed ${feedbackClass || 'hover:bg-muted border-border'} ${isSelected && !showFeedback ? 'bg-secondary' : ''}`}
            >
              {showFeedback && isCorrect && <CheckCircle className="size-4 shrink-0 text-green-600" aria-hidden="true" />}
              {showFeedback && isSelected && !isCorrect && <XCircle className="size-4 shrink-0 text-red-600" aria-hidden="true" />}
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold" aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {showFeedback && (
        <div className="rounded-lg bg-muted p-3 text-sm" role="status" aria-live="polite">
          <span className="font-semibold">Explanation: </span>{question.explanation}
        </div>
      )}
    </div>
  );
}
export default QuizQuestion;
