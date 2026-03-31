import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/60 px-6 pb-8 pt-12">
      <div className="mx-auto max-w-6xl">
        {/* Top grid */}
        <div className="mb-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand shadow-sm shadow-brand/30">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                  <path d="M12 8v4l3 3" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-foreground">
                QueueWorks
              </span>
            </Link>
            <p className="max-w-[180px] text-xs leading-relaxed text-muted">
              Queue jobs, track their progress, retry failures, and cancel tasks — all in real time.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Product
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Tasks", href: "/tasks" },
                { label: "Create Task", href: "/create-task" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-muted transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Resources
            </p>
            <ul className="space-y-2.5">
              {[
                {
                  label: "API Docs",
                  href: "http://localhost:3001/api-docs",
                  external: true,
                },
                {
                  label: "Portfolio",
                  href: "https://marlouamada.dev",
                  external: true,
                },
              ].map(({ label, href, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-xs text-muted transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
              Support
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="text-xs text-muted transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted">
            © {year}{" "}
            <span className="font-semibold text-brand">Marlou Amada</span>. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
