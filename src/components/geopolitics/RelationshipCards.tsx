import type { GeopoliticsDimension } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RelationshipCardsProps {
  dimensions: GeopoliticsDimension[];
}

export function RelationshipCards({ dimensions }: RelationshipCardsProps) {
  return (
    <section aria-labelledby="relationship-cards-heading">
      <h2 id="relationship-cards-heading" className="text-2xl font-semibold mb-4">Cooperation vs Competition</h2>
      <div className="space-y-4">
        {dimensions.map(dim => (
          <Card key={dim.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{dim.dimension}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-green-50 dark:bg-green-950 p-3">
                  <p className="text-xs font-semibold uppercase text-green-700 dark:text-green-300 mb-1">
                    Cooperation (Score: {dim.cooperationScore}/100)
                  </p>
                  <p className="text-sm">{dim.cooperationDescription}</p>
                </div>
                <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3">
                  <p className="text-xs font-semibold uppercase text-red-700 dark:text-red-300 mb-1">
                    Competition (Score: {dim.competitionScore}/100)
                  </p>
                  <p className="text-sm">{dim.competitionDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
export default RelationshipCards;
