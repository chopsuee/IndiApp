'use client';
import { useEffect, useRef, useState } from 'react';
import type { Country } from '@/types';
import { CountryDetailPanel } from './CountryDetailPanel';
import { FallbackSVGMap } from './FallbackSVGMap';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

const CATEGORY_COLORS: Record<string, string> = {
  ally: '#22c55e', partner: '#3b82f6', neutral: '#9ca3af', rival: '#ef4444',
};

const COUNTRY_COORDS: Record<string, [number, number]> = {
  CN: [35.86, 104.19], JP: [36.20, 138.25], KR: [35.91, 127.77],
  BD: [23.68, 90.35], LK: [7.87, 80.77], NP: [28.39, 84.12],
  BT: [27.51, 90.43], MM: [21.91, 95.96], TH: [15.87, 100.99],
  VN: [14.06, 108.28], ID: [-0.79, 113.92], MY: [4.21, 101.97],
  SG: [1.35, 103.82], AF: [33.93, 67.71], PK: [30.38, 69.35],
  IR: [32.43, 53.69], SA: [23.89, 45.08], AE: [23.42, 53.85],
  KZ: [48.02, 66.92], RU: [61.52, 105.32],
};

interface AsiaMapInnerProps { countries: Country[]; }

function AsiaMapInner({ countries }: AsiaMapInnerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapError) return;
    let map: import('leaflet').Map | null = null;
    const container = mapRef.current;
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;

        // Guard against double-init from React Strict Mode: if Leaflet already
        // stamped a _leaflet_id on the container, remove it before re-init.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((container as any)._leaflet_id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (container as any)._leaflet_id;
        }

        // Fix default icon paths for Next.js
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        map = L.map(container, { center: [25, 80], zoom: 3, minZoom: 2, maxZoom: 8 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
        countries.forEach(country => {
          const coords = COUNTRY_COORDS[country.id];
          if (!coords) return;
          const color = CATEGORY_COLORS[country.relationshipCategory] ?? '#9ca3af';
          const icon = L.divIcon({
            html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)" role="img" aria-label="${country.name}"></div>`,
            className: '', iconSize: [12, 12], iconAnchor: [6, 6],
          });
          const marker = L.marker(coords, { icon, title: country.name, alt: country.name });
          marker.on('click', () => { setSelectedCountry(country); setPanelOpen(true); });
          marker.addTo(map!);
        });
      } catch (err) {
        console.error('Map init error:', err);
        setMapError(true);
      }
    };
    initMap();
    return () => {
      map?.remove();
      // Also clear the container id so a re-mount starts clean
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (container) delete (container as any)._leaflet_id;
    };
  }, [countries, mapError]);

  if (mapError) {
    return <FallbackSVGMap countries={countries} onCountryClick={(c) => { setSelectedCountry(c); setPanelOpen(true); }} />;
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden"
        aria-label="Interactive map of Asia showing India's relationships" role="application" />
      <CountryDetailPanel country={selectedCountry} open={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  );
}

export function AsiaMap(props: AsiaMapInnerProps) {
  return (
    <ErrorBoundary fallback={<FallbackSVGMap countries={props.countries} />}>
      <AsiaMapInner {...props} />
    </ErrorBoundary>
  );
}
export default AsiaMap;
