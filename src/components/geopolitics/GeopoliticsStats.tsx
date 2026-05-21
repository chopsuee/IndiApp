'use client';
import type { GeopoliticsDimension } from '@/types';
import { useCountUp } from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';

interface StatItemProps {
  dimension: GeopoliticsDimension;
}

function StatItem({ dimension }: StatItemProps) {
  const count = useCountUp({ target: dimension.statisticValue, duration: 1500 });
  return (
    <Card className="hover-lift border-2 hover:border-primary/30 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-smooth" />
      <CardContent className="relative flex flex-col items-center justify-center gap-2 p-6 text-center">
        <span className="text-4xl font-bold tabular-nums text-gradient-primary">
          {count}
          {dimension.statisticUnit && (
            <span className="text-base font-medium text-muted-foreground ml-1">{dimension.statisticUnit}</span>
          )}
        </span>
        <span className="text-sm font-semibold text-foreground">{dimension.statisticLabel}</span>
        <span className="text-xs text-muted-foreground font-medium px-3 py-1 rounded-full bg-muted">{dimension.dimension}</span>
      </CardContent>
    </Card>
  );
}

interface GeopoliticsStatsProps {
  dimensions: GeopoliticsDimension[];
}

export function GeopoliticsStats({ dimensions }: GeopoliticsStatsProps) {
  return (
    <section aria-labelledby="geopolitics-stats-heading" className="space-y-6">
      <h2 id="geopolitics-stats-heading" className="text-3xl font-bold text-gradient-primary">
        Key Statistics
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {dimensions.map(dim => <StatItem key={dim.id} dimension={dim} />)}
      </div>
    </section>
  );
}
export default GeopoliticsStats;
