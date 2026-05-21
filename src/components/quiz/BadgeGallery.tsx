'use client';

import { useEffect, useState } from 'react';
import type { Badge, UserProgress } from '@/types';
import { Lock } from 'lucide-react';

interface BadgeGalleryProps {
  allBadges: Badge[];
}

const DEFAULT_PROGRESS: UserProgress = {
  totalXP: 0,
  categoryXP: {
    'map-geography': 0,
    'regional-organizations': 0,
    'timeline-history': 0,
    'regionalism-globalization': 0,
    'geopolitics': 0,
  },
  unlockedBadges: [],
  quizHistory: [],
  displayName: 'Player',
};

export function BadgeGallery({ allBadges }: BadgeGalleryProps) {
  // Read unlocked badges from localStorage after mount to avoid hydration mismatch
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<Set<string>>(new Set());
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userProgress');
      if (stored) {
        const progress: UserProgress = JSON.parse(stored);
        const ids = new Set(progress.unlockedBadges.map((b) => b.id));
        setUnlockedBadgeIds(ids);
        setUnlockedBadges(progress.unlockedBadges);
      }
    } catch {
      // localStorage unavailable — show all as locked
    }
  }, []);

  return (
    <section aria-labelledby="badge-gallery-heading">
      <h2 id="badge-gallery-heading" className="text-xl font-semibold mb-3">Achievements</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedBadgeIds.has(badge.id);
          // Get the unlock date from stored progress if available
          const storedBadge = unlockedBadges.find((b) => b.id === badge.id);
          const unlockedAt = storedBadge?.unlockedAt;

          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                isUnlocked
                  ? 'border-primary/30 bg-primary/5'
                  : 'opacity-50'
              }`}
              aria-label={`${badge.name}: ${
                isUnlocked ? 'Unlocked' : 'Locked — ' + badge.description
              }`}
            >
              <div
                className={`flex size-10 items-center justify-center rounded-full ${
                  isUnlocked
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isUnlocked ? (
                  <span className="text-xl" aria-hidden="true">🏆</span>
                ) : (
                  <Lock className="size-5" aria-hidden="true" />
                )}
              </div>
              <span className="text-xs font-medium leading-tight">{badge.name}</span>
              {isUnlocked && unlockedAt ? (
                <span className="text-xs text-primary/70">
                  {new Date(unlockedAt).toLocaleDateString()}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground leading-tight">
                  {badge.description}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BadgeGallery;
