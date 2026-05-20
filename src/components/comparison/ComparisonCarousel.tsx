'use client';
import type { ComparisonItem } from '@/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonCarouselProps {
  items: ComparisonItem[];
}

const STRENGTH_COLORS: Record<string, string> = {
  low: 'text-red-600 dark:text-red-400',
  medium: 'text-amber-600 dark:text-amber-400',
  high: 'text-green-600 dark:text-green-400',
};

export function ComparisonCarousel({ items }: ComparisonCarouselProps) {
  return (
    <Carousel className="w-full" aria-label="Comparison infographic slides">
      <CarouselContent>
        {items.map((item, i) => (
          <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">{item.topic}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1">Regionalism</p>
                  <p className={`text-sm font-medium ${STRENGTH_COLORS[item.regionalismValue]}`}>
                    Strength: {item.regionalismValue}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.regionalismDescription}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-green-600 dark:text-green-400 mb-1">Globalization</p>
                  <p className={`text-sm font-medium ${STRENGTH_COLORS[item.globalizationValue]}`}>
                    Strength: {item.globalizationValue}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{item.globalizationDescription}</p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious aria-label="Previous slide" />
      <CarouselNext aria-label="Next slide" />
    </Carousel>
  );
}
export default ComparisonCarousel;
