import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const KEY_TAKEAWAYS = [
  "India pursues a 'multi-alignment' strategy — engaging both regional blocs and global institutions simultaneously.",
  "India's BRICS and SCO memberships represent regional multilateralism, while G20 reflects its global engagement.",
  "India balances regional connectivity (BRI alternatives, INSTC) with global trade integration (WTO, FTAs).",
  "Cultural diplomacy through regional ties complements India's soft power on the global stage.",
  "India's strategic autonomy allows it to leverage both regionalism and globalization as complementary tools.",
];

export function ComparisonSummary() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" aria-hidden="true" />
          India&apos;s Strategic Position
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {KEY_TAKEAWAYS.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold" aria-hidden="true">
                {i + 1}
              </span>
              {point}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
export default ComparisonSummary;
