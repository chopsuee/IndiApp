'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { OrgCategory } from '@/types';

type FilterValue = 'All' | OrgCategory;

interface OrgFilterProps {
  activeCategory: FilterValue;
  onChange: (category: FilterValue) => void;
}

const CATEGORIES: FilterValue[] = ['All', 'Economic', 'Security', 'Political'];

export function OrgFilter({ activeCategory, onChange }: OrgFilterProps) {
  return (
    <Tabs value={activeCategory} onValueChange={(v) => onChange(v as FilterValue)}>
      <TabsList aria-label="Filter organizations by category">
        {CATEGORIES.map(cat => (
          <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
export default OrgFilter;
