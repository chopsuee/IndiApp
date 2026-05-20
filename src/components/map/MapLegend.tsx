export function MapLegend() {
  const LEGEND_ITEMS = [
    { category: 'ally', label: 'Ally', colorClass: 'bg-green-500' },
    { category: 'partner', label: 'Partner', colorClass: 'bg-blue-500' },
    { category: 'neutral', label: 'Neutral', colorClass: 'bg-gray-400' },
    { category: 'rival', label: 'Rival', colorClass: 'bg-red-500' },
  ] as const;
  return (
    <div role="region" aria-label="Map legend" className="flex flex-wrap gap-3 p-3 rounded-lg border bg-background/90 backdrop-blur-sm">
      <span className="text-xs font-semibold text-muted-foreground">Relationship:</span>
      {LEGEND_ITEMS.map(({ category, label, colorClass }) => (
        <div key={category} className="flex items-center gap-1.5">
          <span className={`size-3 rounded-full ${colorClass}`} aria-hidden="true" />
          <span className="text-xs font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
export default MapLegend;
