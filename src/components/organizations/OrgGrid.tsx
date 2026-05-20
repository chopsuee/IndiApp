'use client';
import { useState } from 'react';
import type { Organization, OrgCategory } from '@/types';
import { OrgCard } from './OrgCard';
import { OrgFilter } from './OrgFilter';

type FilterValue = 'All' | OrgCategory;

interface OrgGridProps {
  organizations: Organization[];
}

export function OrgGrid({ organizations }: OrgGridProps) {
  const [activeCategory, setActiveCategory] = useState<FilterValue>('All');

  const filtered = activeCategory === 'All'
    ? organizations
    : organizations.filter(o => o.category === activeCategory);

  return (
    <div className="space-y-4">
      <OrgFilter activeCategory={activeCategory} onChange={setActiveCategory} />
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No organizations found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map(org => <OrgCard key={org.id} organization={org} />)}
        </div>
      )}
    </div>
  );
}
export default OrgGrid;
