import Link from 'next/link';
import { WifiOff } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline | India in Asia',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <WifiOff className="size-16 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-2xl font-bold">You&apos;re offline</h1>
      <p className="max-w-sm text-muted-foreground">
        It looks like you&apos;ve lost your internet connection. Some pages may still be
        available from cache.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/quiz"
          className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Take a Quiz
        </Link>
      </div>
    </div>
  );
}
