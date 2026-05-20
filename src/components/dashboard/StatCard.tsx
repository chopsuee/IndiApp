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
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-1 p-6 text-center">
        <span className="text-3xl font-bold tabular-nums">
          {count}{unit ? <span className="text-lg font-medium text-muted-foreground ml-1">{unit}</span> : null}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
export default StatCard;
