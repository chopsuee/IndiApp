import type { ComparisonItem, ComparisonStrength } from '@/types';

interface ComparisonTableProps {
  items: ComparisonItem[];
}

const STRENGTH_STYLES: Record<ComparisonStrength, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', label: 'Low' },
  medium: { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300', label: 'Medium' },
  high: { bg: 'bg-green-50 dark:bg-green-950', text: 'text-green-700 dark:text-green-300', label: 'High' },
};

function StrengthCell({ strength }: { strength: ComparisonStrength }) {
  const { bg, text, label } = STRENGTH_STYLES[strength];
  return (
    <td className={`px-4 py-3 text-sm font-medium ${bg} ${text}`}>
      {label}
    </td>
  );
}

export function ComparisonTable({ items }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm" aria-label="Comparison of Regionalism vs Globalization by topic">
        <thead>
          <tr className="border-b bg-muted/50">
            <th scope="col" className="px-4 py-3 text-left font-semibold">Topic</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-blue-700 dark:text-blue-300">Regionalism</th>
            <th scope="col" className="px-4 py-3 text-left font-semibold text-green-700 dark:text-green-300">Globalization</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium">{item.topic}</td>
              <StrengthCell strength={item.regionalismValue} />
              <StrengthCell strength={item.globalizationValue} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ComparisonTable;
