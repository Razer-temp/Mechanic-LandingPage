import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SmartBike Pro — AI-Powered Two-Wheeler Service Center',
  description: 'AI-powered two-wheeler diagnostics, expert mechanics, and affordable pricing. Book your service now!',
  icons: {
    icon: '/favicon.svg',
  },
};

import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { SmoothScroll } from '@/components/ui/SmoothScroll';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-body antialiased selection:bg-accent/20 selection:text-white">
        <SmoothScroll />
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
