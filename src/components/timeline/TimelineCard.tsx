'use client';
import type { TimelineEvent } from '@/types';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Economic: 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent-foreground border border-accent/30',
  Diplomatic: 'bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary-foreground border border-secondary/30',
  Technology: 'bg-gradient-to-r from-purple-500/20 to-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30',
  Space: 'bg-gradient-to-r from-indigo-500/20 to-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30',
  Regional: 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary-foreground border border-primary/30',
};

export function TimelineCard({ event, index }: TimelineCardProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: reduced ? 0 : index * 0.05 }}
      className="relative pl-10 pb-8 last:pb-0 group"
    >
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30 group-last:opacity-0" aria-hidden="true" />
      
      {/* Timeline dot */}
      <div className="absolute left-2 top-2 size-5 rounded-full bg-gradient-to-br from-primary to-accent border-4 border-background shadow-lg group-hover:scale-125 transition-smooth" aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse-subtle" />
      </div>
      
      <div className="rounded-2xl border-2 bg-card p-5 shadow-md hover:shadow-xl transition-smooth hover-lift hover:border-primary/30">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span className="text-2xl font-bold tabular-nums text-gradient-primary">{event.year}</span>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${CATEGORY_COLORS[event.category] ?? ''}`}>
            {event.category}
          </span>
        </div>
        <h3 className="font-bold text-base mb-2 text-foreground leading-snug">{event.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{event.briefDescription}</p>
        {event.detailedDescription && (
          <Accordion className="mt-3">
            <AccordionItem value="details" className="border-0">
              <AccordionTrigger className="text-sm py-2 font-semibold text-primary hover:text-primary/80 transition-smooth">
                Read full details
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <p className="text-sm leading-relaxed">{event.detailedDescription}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </motion.div>
  );
}
export default TimelineCard;
