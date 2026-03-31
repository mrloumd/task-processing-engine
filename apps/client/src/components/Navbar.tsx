'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tasks',     label: 'Tasks' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/' || pathname.startsWith('/dashboard')
      : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-dark transition-colors group-hover:bg-brand">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <span className="font-semibold tracking-tight text-foreground">
              Queue<span className="text-brand-light">Works</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive(href)
                    ? 'bg-brand/10 text-brand-light'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/create-task"
              className="ml-3 rounded-md bg-brand-dark px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand"
            >
              Create Task
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted transition-colors hover:text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-border bg-background/95 backdrop-blur-md transition-all duration-300 md:hidden ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-brand/10 text-brand-light'
                  : 'text-muted hover:bg-surface-raised hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/create-task"
            className="mt-2 rounded-md bg-brand-dark px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-brand"
          >
            Create Task
          </Link>
        </nav>
      </div>
    </header>
  );
}
