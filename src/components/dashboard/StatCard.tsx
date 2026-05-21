'use client';
import { useCountUp } from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  const count = useCountUp({ target: value, duration: 1500 });
  return (
    <Card className="hover-lift border-2 hover:border-primary/50 transition-smooth group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-smooth" />
      <CardContent className="relative flex flex-col items-center justify-center gap-2 p-6 text-center">
        <span className="text-4xl font-bold tabular-nums text-gradient-primary">
          {count}{unit ? <span className="text-lg font-medium text-muted-foreground ml-1">{unit}</span> : null}
        </span>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-smooth">{label}</span>
      </CardContent>
    </Card>
  );
}
export default StatCard;
