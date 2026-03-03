import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-pp-bg-dark min-h-dvh antialiased overflow-x-hidden">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
