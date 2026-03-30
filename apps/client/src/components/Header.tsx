'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

const NAV_LINKS = [
  { href: '/dashboard',   label: 'Dashboard' },
  { href: '/tasks',       label: 'Tasks' },
  { href: '/create-task', label: 'Create Task' },
];

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/' || pathname.startsWith('/dashboard')
      : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark shadow-lg shadow-brand/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
              <path d="M12 8v4l3 3" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            Queue<span className="text-brand-light">Works</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            if (href === '/create-task') {
              return (
                <Link
                  key={href}
                  href={href}
                  className="ml-2 rounded-lg bg-brand px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition-colors hover:bg-brand-dark"
                >
                  {label}
                </Link>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  isActive(href)
                    ? 'bg-brand/10 font-medium text-brand'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Link
            href="/tasks"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted"
          >
            Tasks
          </Link>
          <Link
            href="/create-task"
            className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white"
          >
            + New
          </Link>
        </div>

      </div>
    </header>
  );
}
