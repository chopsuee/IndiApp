'use client';

import { getNotableFigures } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function NotableFigures() {
  const figures = getNotableFigures();
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="notable-figures-heading" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 id="notable-figures-heading" className="text-3xl font-bold text-gradient-primary">
          Notable Figures
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Influential Indians who shaped global thought and action
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((figure, index) => (
          <FigureCard key={figure.id} figure={figure} index={index} reduced={reduced} />
        ))}
      </div>
    </section>
  );
}

function FigureCard({ figure, index, reduced }: { figure: any; index: number; reduced: boolean }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="h-full hover-lift border-2 hover:border-primary/30 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-smooth" />
        
        <CardHeader className="relative pb-3">
          {/* Avatar with image or initials */}
          <div className="flex items-start gap-4 mb-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-smooth flex-shrink-0 bg-gradient-to-br from-primary to-accent">
              {figure.imageUrl && !imageError ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={figure.imageUrl}
                    alt={figure.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image for ${figure.name}:`, figure.imageUrl);
                      setImageError(true);
                    }}
                    onLoad={() => {
                      setImageLoaded(true);
                    }}
                    loading="lazy"
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                  {figure.imageInitials}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight mb-1">
                {figure.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-medium">
                {figure.years}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {figure.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-3">
          <p className="text-sm font-semibold text-primary">
            {figure.title}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {figure.impact}
          </p>

          {/* Achievements Section */}
          {figure.achievements && figure.achievements.length > 0 && (
            <div className="pt-2 border-t border-border/50">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                aria-expanded={expanded}
              >
                <span>Key Achievements</span>
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {expanded && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 space-y-2 text-xs text-muted-foreground"
                >
                  {figure.achievements.map((achievement: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="flex-1">{achievement}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default NotableFigures;
