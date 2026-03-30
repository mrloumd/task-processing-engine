import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QueueWorks — Async Task Processing',
  description: 'Fullstack async task processing engine — NestJS, BullMQ, MongoDB, Next.js',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.classList.add('dark')}})()` }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-10 pt-24">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
