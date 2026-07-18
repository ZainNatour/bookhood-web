import { Container } from "./container";
import { PrimaryCtaButton } from "./primary-cta-button";

type LaunchFooterProps = {
  onJoinClick?: () => void;
};

export function LaunchFooter({ onJoinClick }: LaunchFooterProps) {
  const legalLinks = [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/support", label: "Support" },
    { href: "/account-deletion", label: "Account deletion" },
    { href: "/community-guidelines", label: "Community guidelines" },
    { href: "/content-policy", label: "Content policy" },
  ] as const;

  return (
    <footer className="bg-secondary-container py-[var(--spacing-12)]">
      <Container>
        <div className="rounded-[var(--radius-xl)] border border-outline/40 bg-surface p-[var(--spacing-10)] text-on-surface elevation-level2 sm:p-[var(--spacing-11)]">
          <div className="flex flex-col gap-[var(--spacing-9)] sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-[var(--spacing-6)]">
              <h2 className="headline-medium text-on-surface">
                Link will appear here the moment stores approve us
              </h2>
              <p className="body-medium text-on-surface-variant">
                Keep this tab handy or join the launch list so you are among the first to download BookHood.
              </p>
            </div>
            <PrimaryCtaButton onClick={onJoinClick}>
              Join the launch list
            </PrimaryCtaButton>
          </div>
          <p className="body-medium mt-[var(--spacing-9)] text-on-surface-variant">
            Questions? Email
            {" "}
            <a
              className="underline decoration-primary underline-offset-[var(--spacing-4)] cursor-pointer"
              href="mailto:hello@bookhood.app"
            >
              hello@bookhood.app
            </a>
            {" "}
            and we will reply within one business day.
          </p>
          <nav aria-label="Legal and support" className="mt-[var(--spacing-9)]">
            <ul className="flex flex-wrap gap-x-[var(--spacing-7)] gap-y-[var(--spacing-4)]">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="body-medium text-on-surface-variant underline decoration-outline underline-offset-[var(--spacing-4)] hover:text-primary hover:decoration-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
