'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Building2, Clock, BarChart2, Globe, HelpCircle, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/timeline', label: 'Timeline', icon: Clock },
  { href: '/comparison', label: 'Comparison', icon: BarChart2 },
  { href: '/geopolitics', label: 'Geopolitics', icon: Globe },
  { href: '/quiz', label: 'Quiz', icon: HelpCircle },
];

/**
 * Horizontal top navigation bar — visible only on viewports ≥ 768px.
 * Collapses to a hamburger/Sheet drawer on smaller screens.
 */
export function TopNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 glass shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo / brand - Indian flag only */}
        <Link 
          href="/" 
          className="flex items-center transition-smooth hover:scale-110 group"
          aria-label="Home - India in Asia"
        >
          <div className="relative">
            {/* Indian Flag - Inline */}
            <div className="flex flex-col w-16 h-10 rounded-md overflow-hidden shadow-lg border-2 border-gray-400 dark:border-gray-500 group-hover:shadow-xl transition-smooth">
              {/* Saffron stripe */}
              <div className="h-1/3 bg-[#FF9933]" />
              
              {/* White stripe with Ashoka Chakra */}
              <div className="h-1/3 bg-white flex items-center justify-center relative">
                {/* Ashoka Chakra - 24 spokes wheel */}
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-4 h-4 absolute"
                  fill="none"
                  stroke="#000080"
                  strokeWidth="1.5"
                >
                  {/* Center circle */}
                  <circle cx="12" cy="12" r="4" />
                  
                  {/* 24 spokes */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 360) / 24;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 12 + 4 * Math.cos(rad);
                    const y1 = 12 + 4 * Math.sin(rad);
                    const x2 = 12 + 10 * Math.cos(rad);
                    const y2 = 12 + 10 * Math.sin(rad);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        strokeWidth="0.5"
                      />
                    );
                  })}
                  
                  {/* Outer circle */}
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              
              {/* Green stripe */}
              <div className="h-1/3 bg-[#138808]" />
            </div>
            <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-smooth" />
          </div>
        </Link>

        {/* Desktop nav links — hidden below md */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden group',
                isActive(href)
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive(href) && (
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent animate-scale-in" />
              )}
              <Icon className={cn(
                "size-4 relative z-10 transition-smooth",
                isActive(href) ? "scale-110" : "group-hover:scale-110"
              )} aria-hidden="true" />
              <span className="relative z-10">{label}</span>
              {!isActive(href) && (
                <span className="absolute inset-0 bg-muted opacity-0 group-hover:opacity-100 transition-smooth rounded-lg" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side: theme toggle + mobile hamburger */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Mobile hamburger — visible below md */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="md:hidden hover:bg-primary/10 transition-smooth"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-gradient-primary text-xl">Navigation</SheetTitle>
              </SheetHeader>
              <nav aria-label="Main navigation" className="flex flex-col gap-2 p-4">
                {navItems.map(({ href, label, icon: Icon }, index) => (
                  <Link
                    key={href}
                    href={href}
                    aria-label={label}
                    aria-current={isActive(href) ? 'page' : undefined}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden group animate-slide-in-right',
                      isActive(href)
                        ? 'text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isActive(href) && (
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent" />
                    )}
                    <Icon className={cn(
                      "size-5 relative z-10 transition-smooth",
                      isActive(href) ? "scale-110" : "group-hover:scale-110"
                    )} aria-hidden="true" />
                    <span className="relative z-10">{label}</span>
                    {!isActive(href) && (
                      <span className="absolute inset-0 bg-muted opacity-0 group-hover:opacity-100 transition-smooth rounded-lg" />
                    )}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default TopNav;
