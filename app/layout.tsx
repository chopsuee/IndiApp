import type { Metadata, Viewport } from 'next';
import { Noto_Sans, Noto_Serif } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { InstallPrompt } from '@/components/layout/InstallPrompt';
import ServiceWorkerRegistration from '@/components/layout/ServiceWorkerRegistration';
import { TopNav } from '@/components/layout/TopNav';
import { BottomNav } from '@/components/layout/BottomNav';

// Noto Sans — clean, modern, excellent multilingual/Asian script coverage
const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Noto Serif — editorial feel for headings, pairs well with Noto Sans
const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'India in Asia: Regionalism Explorer',
  description:
    "Explore India's geopolitical influence and regional cooperation across Asia",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IndiAPP',
  },
};

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TopNav />
          <main className="flex-1 pb-16 md:pb-0 md:pt-16">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <BottomNav />
          <InstallPrompt />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
