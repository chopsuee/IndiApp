import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Network } from 'lucide-react';

const REGIONALISM_POINTS = [
  'Prioritises regional trade blocs and agreements',
  'Focuses on geographic proximity and shared interests',
  'Builds regional institutions (SAARC, SCO, ASEAN)',
  'Promotes cultural and historical ties',
  'Addresses region-specific security concerns',
];

const GLOBALIZATION_POINTS = [
  'Promotes global free trade and open markets',
  'Integrates into WTO and multilateral frameworks',
  'Attracts foreign direct investment globally',
  'Participates in G20 and global governance',
  'Engages with global supply chains',
];

export function ComparisonCards() {
  return (
    <section aria-labelledby="comparison-cards-heading">
      <h2 id="comparison-cards-heading" className="sr-only">Regionalism vs Globalization Overview</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Network className="size-5" aria-hidden="true" />
              Regionalism
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {REGIONALISM_POINTS.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 size-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Globe className="size-5" aria-hidden="true" />
              Globalization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {GLOBALIZATION_POINTS.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 size-1.5 rounded-full bg-green-500 shrink-0" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
export default ComparisonCards;
