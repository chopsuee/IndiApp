'use client';

import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks';

/**
 * Button that toggles between dark and light mode.
 * Default theme is light mode. Dark mode is optional.
 *
 * Uses a mounted guard so the icon only renders after hydration,
 * preventing a server/client mismatch caused by localStorage reads.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className="hover:bg-primary/10 transition-smooth relative group"
    >
      {/* Render a placeholder until mounted to avoid hydration mismatch */}
      {mounted ? (
        theme === 'dark' ? (
          <>
            <Sun className="size-5 text-primary group-hover:rotate-90 transition-smooth" aria-hidden="true" />
            <span className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-smooth rounded-full" />
          </>
        ) : (
          <>
            <Moon className="size-5 text-primary group-hover:-rotate-12 transition-smooth" aria-hidden="true" />
            <span className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-smooth rounded-full" />
          </>
        )
      ) : (
        <span className="size-5" aria-hidden="true" />
      )}
    </Button>
  );
}

export default ThemeToggle;
