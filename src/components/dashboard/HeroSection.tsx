'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Map, HelpCircle } from 'lucide-react';

export function HeroSection() {
  const reduced = useReducedMotion();
  const variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.section
      className="flex flex-col items-center justify-center gap-6 px-4 py-16 text-center"
      initial={reduced ? 'visible' : 'hidden'}
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
        India in Asia
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Explore India's geopolitical influence, regional cooperation, and role in Asian affairs through interactive modules.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/map"
          aria-label="Explore the Asia Map"
          className={cn(buttonVariants({ size: 'lg' }))}
        >
          <Map className="mr-2 size-4" aria-hidden="true" />
          Explore Map
        </Link>
        <Link
          href="/quiz"
          aria-label="Take a Quiz"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
        >
          <HelpCircle className="mr-2 size-4" aria-hidden="true" />
          Take a Quiz
        </Link>
      </div>
    </motion.section>
  );
}
export default HeroSection;
