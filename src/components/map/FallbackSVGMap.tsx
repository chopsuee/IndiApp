import type { Country } from '@/types';

interface FallbackSVGMapProps {
  countries: Country[];
  onCountryClick?: (country: Country) => void;
}

const CATEGORY_FILL: Record<string, string> = {
  ally: '#22c55e', partner: '#3b82f6', neutral: '#9ca3af', rival: '#ef4444',
};

const COUNTRY_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  CN: { x: 320, y: 160, label: 'China' }, JP: { x: 400, y: 150, label: 'Japan' },
  KR: { x: 385, y: 155, label: 'S.Korea' }, PK: { x: 230, y: 200, label: 'Pakistan' },
  BD: { x: 290, y: 215, label: 'Bangladesh' }, LK: { x: 270, y: 250, label: 'Sri Lanka' },
  NP: { x: 270, y: 205, label: 'Nepal' }, BT: { x: 280, y: 200, label: 'Bhutan' },
  MM: { x: 310, y: 220, label: 'Myanmar' }, TH: { x: 320, y: 240, label: 'Thailand' },
  VN: { x: 340, y: 235, label: 'Vietnam' }, ID: { x: 350, y: 270, label: 'Indonesia' },
  MY: { x: 340, y: 255, label: 'Malaysia' }, SG: { x: 345, y: 262, label: 'Singapore' },
  AF: { x: 220, y: 185, label: 'Afghanistan' }, IR: { x: 200, y: 190, label: 'Iran' },
  SA: { x: 185, y: 215, label: 'Saudi Arabia' }, AE: { x: 200, y: 215, label: 'UAE' },
  KZ: { x: 240, y: 155, label: 'Kazakhstan' }, RU: { x: 280, y: 120, label: 'Russia' },
};

export function FallbackSVGMap({ countries, onCountryClick }: FallbackSVGMapProps) {
  return (
    <div role="img" aria-label="Simplified map of Asia showing India's relationships">
      <svg viewBox="0 0 500 350" className="w-full h-auto max-h-[500px] rounded-lg bg-sky-50 dark:bg-sky-950">
        <rect width="500" height="350" fill="transparent" />
        <circle cx="260" cy="220" r="12" fill="#f97316" />
        <text x="260" y="224" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">IN</text>
        {countries.map(country => {
          const pos = COUNTRY_POSITIONS[country.id];
          if (!pos || country.id === 'IN') return null;
          const fill = CATEGORY_FILL[country.relationshipCategory] ?? '#9ca3af';
          return (
            <g key={country.id}
              onClick={() => onCountryClick?.(country)}
              style={{ cursor: onCountryClick ? 'pointer' : 'default' }}
              role={onCountryClick ? 'button' : undefined}
              aria-label={onCountryClick ? `View ${country.name} details` : undefined}
              tabIndex={onCountryClick ? 0 : undefined}
              onKeyDown={onCountryClick ? (e) => { if (e.key === 'Enter') onCountryClick(country); } : undefined}
            >
              <circle cx={pos.x} cy={pos.y} r="6" fill={fill} stroke="white" strokeWidth="1" />
              <text x={pos.x} y={pos.y + 14} textAnchor="middle" fontSize="6" fill="#374151">{pos.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
export default FallbackSVGMap;
