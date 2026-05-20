'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Captures the `beforeinstallprompt` event and renders an install banner.
 * Silently hides if the event never fires (already installed or unsupported).
 */
export function InstallPrompt() {
  const [showBanner, setShowBanner] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt.current = null;
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="banner"
      aria-label="Install app prompt"
      className="fixed bottom-20 left-4 right-4 z-50 flex items-center gap-3 rounded-xl border bg-background p-4 shadow-lg md:bottom-4 md:left-auto md:right-4 md:max-w-sm"
    >
      <Download className="size-5 shrink-0 text-primary" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">Add to Home Screen</p>
        <p className="text-xs text-muted-foreground">Install for offline access</p>
      </div>
      <button
        onClick={handleInstall}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        aria-label="Install app"
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        className="rounded-full p-1 hover:bg-muted"
        aria-label="Dismiss install prompt"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default InstallPrompt;
