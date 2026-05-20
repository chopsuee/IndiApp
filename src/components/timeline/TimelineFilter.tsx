'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TimelineCategory } from '@/types';

type FilterValue = 'All' | TimelineCategory;

interface TimelineFilterProps {
  activeCategory: FilterValue;
  onChange: (category: FilterValue) => void;
}

const CATEGORIES: FilterValue[] = ['All', 'Economic', 'Diplomatic', 'Technology', 'Space', 'Regional'];

export function TimelineFilter({ activeCategory, onChange }: TimelineFilterProps) {
  return (
    <Tabs value={activeCategory} onValueChange={(v) => onChange(v as FilterValue)}>
      <TabsList aria-label="Filter timeline events by category" className="flex-wrap h-auto">
        {CATEGORIES.map(cat => (
          <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
export default TimelineFilter;
