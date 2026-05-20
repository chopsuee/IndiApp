'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps page content with a fade-in/slide-up entrance animation.
 * Skips the animation when the user has requested reduced motion.
 */
export function PageWrapper({ children, className }: PageWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
  const animate = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;
