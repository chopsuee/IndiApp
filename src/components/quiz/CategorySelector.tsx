'use client';
import Link from 'next/link';
import type { QuizCategory } from '@/types';
import { Map, Building2, Clock, BarChart2, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CATEGORIES: { id: QuizCategory; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'map-geography', label: 'Map & Geography', icon: Map, description: 'Asian geography and borders' },
  { id: 'regional-organizations', label: 'Regional Organizations', icon: Building2, description: 'BRICS, SAARC, SCO & more' },
  { id: 'timeline-history', label: 'Timeline & History', icon: Clock, description: 'Historical milestones' },
  { id: 'regionalism-globalization', label: 'Regionalism vs Globalization', icon: BarChart2, description: "India's strategic approach" },
  { id: 'geopolitics', label: 'Geopolitics', icon: Globe, description: 'Cooperation & competition' },
];

export function CategorySelector() {
  return (
    <section aria-labelledby="quiz-categories-heading">
      <h2 id="quiz-categories-heading" className="text-2xl font-semibold mb-4">Choose a Category</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map(({ id, label, icon: Icon, description }) => (
          <Link key={id} href={`/quiz/${id}`} aria-label={`Start ${label} quiz`}>
            <Card className="h-full cursor-pointer transition-colors hover:bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
export default CategorySelector;
