import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

const vactorySans = localFont({
  src: '../../public/fonts/VactorySansRegular-drrAV.woff',
  variable: '--font-vactory',
  display: 'swap',
});

const kgHappy = localFont({
  src: '../../public/fonts/kghappy.woff',
  variable: '--font-kghappy',
  display: 'swap',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${vactorySans.variable} ${kgHappy.variable}`} suppressHydrationWarning>
      <body className={`flex flex-col min-h-screen ${vactorySans.className}`}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
