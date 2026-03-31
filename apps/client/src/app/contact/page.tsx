"use client";

import { useState } from "react";
import Link from "next/link";
import { contactApi } from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
const INITIAL: FormState = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await contactApi.send(form);
      setSuccess(true);
      setForm(INITIAL);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 pt-16">
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[200px] w-[500px] rounded-full bg-brand/8 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 pt-10 pb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-5 group"
          >
            <svg
              className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            Contact
          </h1>
          <p className="text-muted text-sm">
            Got a question, feedback, spotted a bug, or just want to
            connect?
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="grid gap-10 sm:grid-cols-5">
          {/* Left — info */}
          <div className="space-y-6 sm:col-span-2">
            <div>
              <p className="mb-1 text-sm font-semibold text-foreground">
                Email
              </p>
              <p className="text-sm text-muted">
                You&apos;ll receive a response within 24 hours.
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold text-foreground">
                Feedback
              </p>
              <p className="text-sm text-muted">
                Suggestions for new task types, workflow improvements, or
                anything else you&apos;d like to see.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="sm:col-span-3">
            {success ? (
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-6 py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/15">
                  <svg
                    className="h-6 w-6 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="mb-1 text-base font-semibold text-foreground">
                  Message sent!
                </p>
                <p className="text-sm text-muted">
                  Thanks for reaching out. I&apos;ll get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-5 text-sm text-brand-light hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-2xl border border-border bg-surface p-6"
              >
                {/* Name + Email row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-brand/50 focus:bg-surface"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-brand/50 focus:bg-surface"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Subject
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                    className="w-full rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-brand/50 focus:bg-surface"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us more..."
                    className="w-full resize-none rounded-xl border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-brand/50 focus:bg-surface"
                  />
                </div>

                {error && <p className="text-xs text-rose-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
