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
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-1 p-6 text-center">
        <span className="text-3xl font-bold tabular-nums">
          {count}
          {dimension.statisticUnit && (
            <span className="text-lg font-medium text-muted-foreground ml-1">{dimension.statisticUnit}</span>
          )}
        </span>
        <span className="text-sm font-medium">{dimension.statisticLabel}</span>
        <span className="text-xs text-muted-foreground">{dimension.dimension}</span>
      </CardContent>
    </Card>
  );
}

interface GeopoliticsStatsProps {
  dimensions: GeopoliticsDimension[];
}

export function GeopoliticsStats({ dimensions }: GeopoliticsStatsProps) {
  return (
    <section aria-labelledby="geopolitics-stats-heading">
      <h2 id="geopolitics-stats-heading" className="text-2xl font-semibold mb-4">Key Statistics</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {dimensions.map(dim => <StatItem key={dim.id} dimension={dim} />)}
      </div>
    </section>
  );
}
export default GeopoliticsStats;
