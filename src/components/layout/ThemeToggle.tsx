'use client';

import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks';

/**
 * Button that toggles between dark and light mode.
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
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      {/* Render a placeholder until mounted to avoid hydration mismatch */}
      {mounted ? (
        theme === 'dark' ? (
          <Sun className="size-5" aria-hidden="true" />
        ) : (
          <Moon className="size-5" aria-hidden="true" />
        )
      ) : (
        <span className="size-5" aria-hidden="true" />
      )}
    </Button>
  );
}

export default ThemeToggle;
