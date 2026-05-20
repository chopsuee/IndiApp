'use client';

import dynamic from 'next/dynamic';
import type { Country } from '@/types';

const AsiaMapClient = dynamic(
  () => import('./AsiaMap').then((m) => m.AsiaMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] md:h-[500px] rounded-lg bg-muted animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading map…</span>
      </div>
    ),
  }
);

interface AsiaMapDynamicProps {
  countries: Country[];
}

export function AsiaMapDynamic({ countries }: AsiaMapDynamicProps) {
  return <AsiaMapClient countries={countries} />;
}

export default AsiaMapDynamic;
