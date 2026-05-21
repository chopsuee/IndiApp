'use client';
import type { Country } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CountryDetailPanelProps {
  country: Country | null;
  open: boolean;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  ally: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  partner: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  rival: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function CountryDetailPanel({ country, open, onClose }: CountryDetailPanelProps) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      {/* z-[1000] ensures the sheet renders above Leaflet's map panes (z-index 400–600) */}
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto z-[1000]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {country && <><span className="text-2xl" aria-hidden="true">{country.flag}</span><span>{country.name}</span></>}
          </SheetTitle>
        </SheetHeader>
        {country && (
          <div className="mt-4 space-y-4 px-1">
            <div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Relationship</span>
              <div className="mt-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${CATEGORY_COLORS[country.relationshipCategory]}`}>
                  {country.relationshipCategory}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Trade Relations</span>
              <p className="mt-1 text-sm">{country.tradeSummary}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Diplomatic Ties</span>
              <p className="mt-1 text-sm">{country.diplomaticTiesSummary}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Alliance Memberships</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {country.allianceMemberships.length > 0
                  ? country.allianceMemberships.map(m => <Badge key={m} variant="secondary">{m}</Badge>)
                  : <span className="text-sm text-muted-foreground">No shared alliances</span>}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Cultural Influence</span>
              <p className="mt-1 text-sm">{country.culturalInfluenceNotes}</p>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-muted-foreground">Cooperation Score</span>
                  <span className="font-medium text-green-600">{country.cooperationScore}/100</span>
                </div>
                <Progress value={country.cooperationScore} aria-label={`Cooperation score: ${country.cooperationScore} out of 100`} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-muted-foreground">Conflict Score</span>
                  <span className="font-medium text-red-600">{country.conflictScore}/100</span>
                </div>
                <Progress value={country.conflictScore} aria-label={`Conflict score: ${country.conflictScore} out of 100`} />
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
export default CountryDetailPanel;
