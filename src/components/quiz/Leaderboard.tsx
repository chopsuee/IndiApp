import type { UserProgress } from '@/types';
import { sortLeaderboard } from '@/lib/quiz';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  users: UserProgress[];
  currentUserName?: string;
}

export function Leaderboard({ users, currentUserName }: LeaderboardProps) {
  const sorted = sortLeaderboard(users);
  return (
    <section aria-labelledby="leaderboard-heading">
      <h2 id="leaderboard-heading" className="text-xl font-semibold mb-3 flex items-center gap-2">
        <Trophy className="size-5 text-amber-500" aria-hidden="true" />
        Leaderboard
      </h2>
      {sorted.length === 0 ? (
        <p className="text-muted-foreground text-sm">No scores yet. Complete a quiz to appear here!</p>
      ) : (
        <ol className="space-y-2">
          {sorted.map((user, index) => {
            const isCurrentUser = user.displayName === currentUserName;
            return (
              <li key={user.displayName} className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 ${isCurrentUser ? 'border-primary bg-primary/5' : ''}`}
                aria-current={isCurrentUser ? 'true' : undefined}>
                <span className="w-6 text-center text-sm font-bold text-muted-foreground" aria-label={`Rank ${index + 1}`}>
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-medium">{user.displayName}</span>
                <span className="text-sm font-bold text-amber-600">{user.totalXP} XP</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
export default Leaderboard;
