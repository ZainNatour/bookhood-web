"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PrimaryCtaButton } from "./primary-cta-button";

const focusableSelectors = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

const benefits = [
  "Early access to the app the moment stores approve it",
  "Launch-week bonus credits for your first swaps",
  "Invites to community pilot events and beta groups",
] as const;

type LaunchModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LaunchModal({ open, onClose }: LaunchModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setEmail("");
      document.body.style.removeProperty("overflow");
      lastFocusedRef.current?.focus();
      return undefined;
    }

    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.setProperty("overflow", "hidden");
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors));
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeElement = document.activeElement as HTMLElement | null;

        if (!event.shiftKey && activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(timer);
      document.body.style.removeProperty("overflow");
    };
  }, [open, onClose]);

  const isSubmitDisabled = useMemo(() => email.trim().length === 0, [email]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/80 px-[var(--container-padding-sm)]"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-xl rounded-[var(--radius-xl)] border border-outline/40 bg-surface p-[var(--spacing-11)] text-on-surface elevation-level3"
        role="dialog"
        aria-modal="true"
        aria-labelledby="launch-modal-title"
        aria-describedby="launch-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-[var(--spacing-6)]">
          <div className="space-y-[var(--spacing-4)]">
            <p className="label-medium text-on-surface-variant">Launch list</p>
            <h2 id="launch-modal-title" className="headline-medium text-on-surface">
              Be the first to know when BookHood launches
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[var(--spacing-12)] w-[var(--spacing-12)] items-center justify-center rounded-[var(--radius-lg)] border border-outline/60 bg-surface-variant text-on-surface-variant cursor-pointer transition ease-[var(--easing-standard)] hover:text-on-surface focus-visible:outline focus-visible:outline-[var(--spacing-1)] focus-visible:outline-offset-[var(--spacing-2)] focus-visible:outline-primary"
            aria-label="Close launch list modal"
          >
            <span aria-hidden className="text-title-medium leading-none">&times;</span>
          </button>
        </div>

        <p id="launch-modal-description" className="body-medium mt-[var(--spacing-7)] text-on-surface-variant">
          Join our launch list to receive the store links instantly and unlock bonuses crafted for early community members.
        </p>

        <ul className="mt-[var(--spacing-8)] space-y-[var(--spacing-4)] text-on-surface">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-[var(--spacing-4)] body-medium">
              <span
                aria-hidden
                className="mt-[var(--spacing-1)] inline-flex h-[var(--spacing-4)] w-[var(--spacing-4)] flex-shrink-0 rounded-full bg-primary"
              />
              {benefit}
            </li>
          ))}
        </ul>

        <form className="mt-[var(--spacing-9)] space-y-[var(--spacing-6)]" onSubmit={handleSubmit}>
          <div className="space-y-[var(--spacing-3)]">
            <label className="title-medium text-on-surface" htmlFor="launch-email">
              Email address
            </label>
            <input
              id="launch-email"
              ref={inputRef}
              type="email"
              inputMode="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-[var(--radius-lg)] border border-outline/60 bg-surface px-[var(--spacing-7)] py-[var(--spacing-6)] body-medium text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <p className="body-small text-on-surface-variant">
              We send one notification when the app is live. Unsubscribe anytime.
            </p>
          </div>

          <PrimaryCtaButton type="submit" disabled={isSubmitDisabled}>
            Notify me and add me to the launch list
          </PrimaryCtaButton>
        </form>

        {status === "success" ? (
          <div
            className="mt-[var(--spacing-8)] rounded-[var(--radius-lg)] border border-success bg-success-soft p-[var(--spacing-7)]"
            aria-live="polite"
          >
            <p className="title-medium text-success">{"You\u0027re on the list!"}</p>
            <p className="body-medium text-on-surface-variant">
              Expect a confirmation email soon. {"We\u0027ll share the download links and bonus codes as soon as stores approve us."}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}