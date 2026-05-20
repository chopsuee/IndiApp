'use client';
import { useState } from 'react';
import type { TimelineEvent, TimelineCategory } from '@/types';
import { TimelineCard } from './TimelineCard';
import { TimelineFilter } from './TimelineFilter';

type FilterValue = 'All' | TimelineCategory;

interface TimelineViewProps {
  events: TimelineEvent[];
}

export function TimelineView({ events }: TimelineViewProps) {
  const [activeCategory, setActiveCategory] = useState<FilterValue>('All');
  const filtered = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory);
  return (
    <div className="space-y-4">
      <TimelineFilter activeCategory={activeCategory} onChange={setActiveCategory} />
      {filtered.length === 0
        ? <p className="text-center text-muted-foreground py-8">No events found for this category.</p>
        : <div className="mt-4">{filtered.map((event, index) => <TimelineCard key={event.id} event={event} index={index} />)}</div>
      }
    </div>
  );
}
export default TimelineView;
