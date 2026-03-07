import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import PauseButton from '@/components/pause/PauseButton';

export const metadata: Metadata = {
  title: 'Power Pair — Relationship Intelligence',
  description:
    'Discover your relationship archetype, understand your emotional patterns, and build deeper connection with your partner.',
  keywords: ['relationship', 'emotional intelligence', 'couples', 'archetype', 'love style'],
  authors: [{ name: 'Power Pair' }],
  openGraph: {
    title: 'Power Pair — Relationship Intelligence',
    description:
      'Discover your relationship archetype and emotional intelligence profile.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#111218',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-pp-bg-dark min-h-dvh antialiased overflow-x-hidden">
        <AppProvider>{children}<PauseButton /></AppProvider>
      </body>
    </html>
  );
}
