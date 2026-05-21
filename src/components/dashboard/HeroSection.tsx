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
      className="relative flex flex-col items-center justify-center gap-6 px-4 py-20 text-center overflow-hidden"
      initial={reduced ? 'visible' : 'hidden'}
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pattern-dots opacity-50" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-subtle" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 space-y-6">
        <motion.div
          initial={reduced ? {} : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient-primary">India</span> in{' '}
            <span className="text-gradient-secondary">Asia</span>
          </h1>
        </motion.div>
        
        <motion.p
          className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed"
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Explore India's geopolitical influence, regional cooperation, and transformative role in shaping Asian affairs through interactive modules and rich visualizations.
        </motion.p>
        
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/map"
            aria-label="Explore the Asia Map"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'gradient-primary hover:shadow-xl transition-smooth hover:scale-105 group'
            )}
          >
            <Map className="mr-2 size-5 group-hover:rotate-12 transition-smooth" aria-hidden="true" />
            Explore Map
          </Link>
          <Link
            href="/quiz"
            aria-label="Take a Quiz"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'border-2 hover:border-primary hover:shadow-lg transition-smooth hover:scale-105 group'
            )}
          >
            <HelpCircle className="mr-2 size-5 group-hover:rotate-12 transition-smooth" aria-hidden="true" />
            Take a Quiz
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
export default HeroSection;
