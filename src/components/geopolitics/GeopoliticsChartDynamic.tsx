'use client';

import dynamic from 'next/dynamic';
import type { GeopoliticsDimension } from '@/types';

const GeopoliticsChartClient = dynamic(
  () => import('./GeopoliticsChart').then((m) => m.GeopoliticsChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[350px] rounded-lg bg-muted animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading chart…</span>
      </div>
    ),
  }
);

interface GeopoliticsChartDynamicProps {
  dimensions: GeopoliticsDimension[];
}

export function GeopoliticsChartDynamic({ dimensions }: GeopoliticsChartDynamicProps) {
  return <GeopoliticsChartClient dimensions={dimensions} />;
}

export default GeopoliticsChartDynamic;
