'use client';

import { useEffect } from 'react';

/**
 * Registers the PWA Service Worker on mount.
 * Renders nothing — side-effect only.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        // SW registration is best-effort; log but don't crash
        console.warn('Service Worker registration failed:', err);
      });
    }
  }, []);

  return null;
}

export default ServiceWorkerRegistration;
