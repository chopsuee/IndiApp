'use client';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks';

const REGIONS = [
  { label: 'South Asia', angle: 0, color: 'text-blue-500' },
  { label: 'SE Asia', angle: 60, color: 'text-green-500' },
  { label: 'East Asia', angle: 120, color: 'text-yellow-500' },
  { label: 'Central Asia', angle: 180, color: 'text-purple-500' },
  { label: 'West Asia', angle: 240, color: 'text-red-500' },
  { label: 'Russia/CIS', angle: 300, color: 'text-orange-500' },
];

export function InfoGraphic() {
  const reduced = useReducedMotion();
  return (
    <section aria-label="India's regional reach infographic" className="flex flex-col items-center gap-4 py-8">
      <h2 className="text-2xl font-semibold">India's Regional Reach</h2>
      <div className="relative size-64">
        {/* Central India node */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
            India
          </div>
        </div>
        {/* Surrounding region nodes */}
        {REGIONS.map(({ label, angle, color }, i) => {
          const rad = (angle * Math.PI) / 180;
          const r = 96;
          const x = 128 + r * Math.cos(rad) - 32;
          const y = 128 + r * Math.sin(rad) - 16;
          return (
            <motion.div
              key={label}
              className={`absolute text-xs font-medium ${color}`}
              style={{ left: x, top: y, width: 64, textAlign: 'center' }}
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduced ? 0 : i * 0.1, duration: 0.4 }}
            >
              {label}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
export default InfoGraphic;
