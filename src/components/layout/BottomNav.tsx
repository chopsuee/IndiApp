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
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur-sm md:hidden"
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
              'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
