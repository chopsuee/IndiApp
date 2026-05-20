import Link from 'next/link';
import { Map, Building2, Clock, BarChart2, Globe, HelpCircle } from 'lucide-react';

const tiles = [
  { href: '/map', label: 'Asia Map', icon: Map, description: 'Explore bilateral relationships' },
  { href: '/organizations', label: 'Organizations', icon: Building2, description: 'BRICS, SAARC, G20 & more' },
  { href: '/timeline', label: 'Timeline', icon: Clock, description: 'Historical milestones' },
  { href: '/comparison', label: 'Comparison', icon: BarChart2, description: 'Regionalism vs Globalization' },
  { href: '/geopolitics', label: 'Geopolitics', icon: Globe, description: 'Cooperation & competition' },
  { href: '/quiz', label: 'Quiz', icon: HelpCircle, description: 'Test your knowledge' },
];

export function QuickNav() {
  return (
    <section aria-labelledby="quick-nav-heading">
      <h2 id="quick-nav-heading" className="text-2xl font-semibold mb-4">Explore Modules</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map(({ href, label, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-colors hover:bg-muted"
          >
            <Icon className="size-8 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs text-muted-foreground hidden sm:block">{description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
export default QuickNav;
