import type { QuizCategory } from '@/types';
import { shouldShowCertificate } from '@/lib/quiz';
import { Award } from 'lucide-react';

interface CertificateProps {
  category: QuizCategory;
  score: number; // 0.0–1.0
  completedAt?: string;
}

export function Certificate({ category, score, completedAt }: CertificateProps) {
  if (!shouldShowCertificate(score)) return null;
  const scorePercent = Math.round(score * 100);
  const date = completedAt ? new Date(completedAt).toLocaleDateString() : new Date().toLocaleDateString();
  const categoryLabel = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center space-y-4" role="region" aria-label="Completion certificate">
      <Award className="size-16 text-primary mx-auto" aria-hidden="true" />
      <h2 className="text-2xl font-bold">Certificate of Completion</h2>
      <p className="text-muted-foreground">This certifies successful completion of</p>
      <p className="text-xl font-semibold text-primary">{categoryLabel}</p>
      <p className="text-3xl font-bold">{scorePercent}%</p>
      <p className="text-sm text-muted-foreground">Completed on {date}</p>
      <p className="text-sm font-medium">India in Asia: Regionalism Explorer</p>
    </div>
  );
}
export default Certificate;
