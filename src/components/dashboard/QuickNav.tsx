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
    <section aria-labelledby="quick-nav-heading" className="space-y-6">
      <h2 id="quick-nav-heading" className="text-3xl font-bold text-gradient-primary">
        Explore Modules
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {tiles.map(({ href, label, icon: Icon, description }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className="group relative flex flex-col items-center gap-3 rounded-2xl border-2 bg-card p-6 text-center transition-smooth hover:border-primary/50 hover-lift overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-smooth" />
            <div className="relative z-10 p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-smooth">
              <Icon className="size-8 text-primary group-hover:scale-110 transition-smooth" aria-hidden="true" />
            </div>
            <div className="relative z-10 space-y-1">
              <span className="text-sm font-semibold group-hover:text-primary transition-smooth">{label}</span>
              <span className="text-xs text-muted-foreground hidden sm:block leading-relaxed">{description}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
export default QuickNav;
