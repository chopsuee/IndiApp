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
  Economic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Diplomatic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Technology: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Space: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  Regional: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export function TimelineCard({ event, index }: TimelineCardProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: reduced ? 0 : index * 0.05 }}
      className="relative pl-8 pb-6 last:pb-0"
    >
      <div className="absolute left-3 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
      <div className="absolute left-1.5 top-1.5 size-3 rounded-full bg-primary border-2 border-background" aria-hidden="true" />
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-lg font-bold tabular-nums text-primary">{event.year}</span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[event.category] ?? ''}`}>
            {event.category}
          </span>
        </div>
        <h3 className="font-semibold text-sm mb-1">{event.title}</h3>
        <p className="text-sm text-muted-foreground">{event.briefDescription}</p>
        {event.detailedDescription && (
          <Accordion className="mt-2">
            <AccordionItem value="details" className="border-0">
              <AccordionTrigger className="text-xs py-1 text-muted-foreground hover:text-foreground">
                Read more
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm mt-1">{event.detailedDescription}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </motion.div>
  );
}
export default TimelineCard;
