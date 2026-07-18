import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "./container";

export type LegalSection = {
  title: string;
  body?: ReactNode;
  items?: readonly ReactNode[];
};

type LegalPageProps = {
  title: string;
  description: string;
  updatedAt: string;
  sections: readonly LegalSection[];
};

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
  { href: "/account-deletion", label: "Account deletion" },
  { href: "/community-guidelines", label: "Community guidelines" },
  { href: "/content-policy", label: "Content policy" },
] as const;

export function LegalPage({ title, description, updatedAt, sections }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <header className="border-b border-outline/60 bg-surface-variant/60">
        <Container className="py-[var(--spacing-10)] sm:py-[var(--spacing-12)]">
          <Link
            href="/"
            className="label-medium inline-flex text-primary underline decoration-primary/60 underline-offset-[var(--spacing-4)]"
          >
            BookHood
          </Link>
          <div className="mt-[var(--spacing-8)] max-w-[var(--container-max-md)]">
            <p className="label-medium text-on-surface-variant">Last updated {updatedAt}</p>
            <h1 className="display-large mt-[var(--spacing-4)] text-on-surface">{title}</h1>
            <p className="body-large mt-[var(--spacing-6)] text-on-surface-variant">{description}</p>
          </div>
        </Container>
      </header>

      <Container className="grid gap-[var(--spacing-10)] py-[var(--spacing-10)] lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:py-[var(--spacing-12)]">
        <nav aria-label="Legal pages" className="lg:sticky lg:top-[var(--spacing-7)] lg:self-start">
          <ul className="grid gap-[var(--spacing-4)] rounded-[var(--radius-md)] border border-outline/60 bg-surface p-[var(--spacing-6)]">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="body-medium text-on-surface-variant underline decoration-outline underline-offset-[var(--spacing-4)] hover:text-primary hover:decoration-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-[var(--container-max-lg)] space-y-[var(--spacing-9)]">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[var(--radius-md)] border border-outline/60 bg-surface p-[var(--spacing-7)] sm:p-[var(--spacing-9)]"
            >
              <h2 className="headline-medium text-on-surface">{section.title}</h2>
              {section.body ? (
                <div className="body-medium mt-[var(--spacing-5)] space-y-[var(--spacing-5)] text-on-surface-variant">
                  {section.body}
                </div>
              ) : null}
              {section.items?.length ? (
                <ul className="body-medium mt-[var(--spacing-5)] list-disc space-y-[var(--spacing-4)] pl-[var(--spacing-8)] text-on-surface-variant">
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </Container>
    </main>
  );
}
