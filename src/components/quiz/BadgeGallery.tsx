import type { Badge } from '@/types';
import { Lock } from 'lucide-react';

interface BadgeGalleryProps {
  allBadges: Badge[];
  unlockedBadgeIds: Set<string>;
}

export function BadgeGallery({ allBadges, unlockedBadgeIds }: BadgeGalleryProps) {
  return (
    <section aria-labelledby="badge-gallery-heading">
      <h2 id="badge-gallery-heading" className="text-xl font-semibold mb-3">Achievements</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {allBadges.map(badge => {
          const isUnlocked = unlockedBadgeIds.has(badge.id);
          return (
            <div key={badge.id}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-opacity ${isUnlocked ? '' : 'opacity-40'}`}
              aria-label={`${badge.name}: ${isUnlocked ? 'Unlocked' : 'Locked — ' + badge.description}`}>
              <div className={`flex size-10 items-center justify-center rounded-full ${isUnlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {isUnlocked ? (
                  <span className="text-xl" aria-hidden="true">🏆</span>
                ) : (
                  <Lock className="size-5" aria-hidden="true" />
                )}
              </div>
              <span className="text-xs font-medium leading-tight">{badge.name}</span>
              {!isUnlocked && <span className="text-xs text-muted-foreground leading-tight">{badge.description}</span>}
              {isUnlocked && badge.unlockedAt && (
                <span className="text-xs text-muted-foreground">{new Date(badge.unlockedAt).toLocaleDateString()}</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default BadgeGallery;
