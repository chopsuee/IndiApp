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
    <section aria-labelledby="comparison-cards-heading" className="space-y-6">
      <h2 id="comparison-cards-heading" className="text-3xl font-bold text-gradient-primary">
        Two Approaches to Global Engagement
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-2 border-secondary/30 hover-lift hover:border-secondary/50 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-50" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-secondary text-xl">
              <div className="p-2 rounded-xl bg-secondary/20">
                <Network className="size-6" aria-hidden="true" />
              </div>
              Regionalism
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <ul className="space-y-3">
              {REGIONALISM_POINTS.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm group/item">
                  <span className="mt-1.5 size-2 rounded-full bg-secondary shrink-0 group-hover/item:scale-125 transition-smooth" aria-hidden="true" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-2 border-accent/30 hover-lift hover:border-accent/50 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-accent-foreground text-xl">
              <div className="p-2 rounded-xl bg-accent/20">
                <Globe className="size-6" aria-hidden="true" />
              </div>
              Globalization
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <ul className="space-y-3">
              {GLOBALIZATION_POINTS.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-sm group/item">
                  <span className="mt-1.5 size-2 rounded-full bg-accent shrink-0 group-hover/item:scale-125 transition-smooth" aria-hidden="true" />
                  <span className="leading-relaxed">{point}</span>
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
