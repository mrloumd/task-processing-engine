import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QueueWorks',
  description: 'Async task processing platform',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        <Providers>
          <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <span className="text-lg font-bold tracking-tight text-blue-600">
                QueueWorks
              </span>
              <span className="text-xs text-zinc-500">Async Task Processing</span>
            </div>
          </header>
          <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
