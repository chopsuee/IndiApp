'use client';
import type { GeopoliticsDimension } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

interface GeopoliticsChartProps {
  dimensions: GeopoliticsDimension[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; payload: GeopoliticsDimension }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const dim = payload[0]?.payload;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm max-w-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.name === 'cooperationScore' ? '#22c55e' : '#ef4444' }}>
          {entry.name === 'cooperationScore' ? 'Cooperation' : 'Competition'}: {entry.value}/100
        </p>
      ))}
      {dim?.tooltipNote && <p className="text-muted-foreground mt-1 text-xs">{dim.tooltipNote}</p>}
    </div>
  );
}

function GeopoliticsChartInner({ dimensions }: GeopoliticsChartProps) {
  const data = dimensions.map(d => ({
    ...d,
    name: d.dimension.length > 12 ? d.dimension.slice(0, 12) + '…' : d.dimension,
  }));

  return (
    <section aria-labelledby="geopolitics-chart-heading">
      <h2 id="geopolitics-chart-heading" className="text-2xl font-semibold mb-4">Scores Overview</h2>
      <div className="w-full h-[350px]" role="img" aria-label="Bar chart comparing cooperation and competition scores across geopolitical dimensions">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="cooperationScore" name="Cooperation" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="competitionScore" name="Competition" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function GeopoliticsChart(props: GeopoliticsChartProps) {
  return (
    <ErrorBoundary>
      <GeopoliticsChartInner {...props} />
    </ErrorBoundary>
  );
}
export default GeopoliticsChart;
