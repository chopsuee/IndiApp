'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Building2, Clock, BarChart2, Globe, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/organizations', label: 'Orgs', icon: Building2 },
  { href: '/timeline', label: 'Timeline', icon: Clock },
  { href: '/comparison', label: 'Compare', icon: BarChart2 },
  { href: '/geopolitics', label: 'Geopolitics', icon: Globe },
  { href: '/quiz', label: 'Quiz', icon: HelpCircle },
];

/**
 * Sticky bottom navigation bar — visible only on viewports < 768px.
 * Highlights the active route using usePathname().
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border/50 glass shadow-lg md:hidden"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm group',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              <Icon className={cn(
                "size-5 transition-smooth",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} aria-hidden="true" />
              {isActive && (
                <>
                  <span className="absolute inset-0 bg-primary/20 blur-lg animate-pulse-subtle" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-scale-in" />
                </>
              )}
            </div>
            <span className={cn(
              "transition-smooth",
              isActive && "font-semibold"
            )}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
