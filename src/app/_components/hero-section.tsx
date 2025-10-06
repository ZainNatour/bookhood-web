import { Container } from "./container";
import { PrimaryCtaButton } from "./primary-cta-button";

type HeroSectionProps = {
  onNotifyClick?: () => void;
};

export function HeroSection({ onNotifyClick }: HeroSectionProps) {
  return (
    <header className="relative isolate overflow-hidden bg-surface">
      <Container className="py-[var(--spacing-12)] sm:py-[var(--spacing-12)] lg:py-[var(--spacing-14)]">
        <div className="grid gap-[var(--spacing-12)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center">
          <div className="space-y-[var(--spacing-7)]">
            <span className="inline-flex w-fit items-center gap-[var(--spacing-4)] rounded-[var(--radius-pill)] bg-primary-container px-[var(--spacing-8)] py-[var(--spacing-4)] label-medium text-on-primary-container cursor-default">
              <span
                aria-hidden
                className="inline-flex flex-shrink-0 translate-y-[var(--spacing-2)] rounded-full bg-primary"
                style={{ width: "var(--spacing-5)", height: "var(--spacing-5)" }}
              />
              App store launches coming soon
            </span>
            <h1 className="display-large max-w-[32ch] text-balance text-on-surface">
              Trade stories, not just books.
            </h1>
            <p className="body-large max-w-[min(54ch,var(--container-max-md))] text-on-surface-variant">
              BookHood connects nearby readers so you can swap, lend, or donate books without leaving your neighbourhood. We are finalising the iOS and Android releases -- check back soon or get notified when the app is live.
            </p>
            <div className="flex flex-wrap items-center gap-[var(--spacing-7)] pt-[var(--spacing-7)]">
              <PrimaryCtaButton onClick={onNotifyClick}>
                Notify me at launch
              </PrimaryCtaButton>
              <div className="flex flex-col gap-[var(--spacing-5)] sm:flex-row">
                <span
                  className="inline-flex items-center justify-center rounded-[var(--radius-lg)] border border-outline/70 bg-surface px-[var(--spacing-9)] py-[var(--spacing-7)] title-medium text-on-surface opacity-70 cursor-not-allowed pointer-events-none"
                  aria-disabled="true"
                >
                  App Store link pending
                </span>
                <span
                  className="inline-flex items-center justify-center rounded-[var(--radius-lg)] border border-outline/70 bg-surface px-[var(--spacing-9)] py-[var(--spacing-7)] title-medium text-on-surface opacity-70 cursor-not-allowed pointer-events-none"
                  aria-disabled="true"
                >
                  Google Play link pending
                </span>
              </div>
            </div>
            <p className="body-medium text-on-surface-variant">
              Add this page to your bookmarks and be the first to receive a download link. No spam, just books.
            </p>
          </div>
          <div className="rounded-[var(--radius-xl)] bg-secondary-container/80 p-[var(--spacing-9)] elevation-level1">
            <div className="space-y-[var(--spacing-8)]">
              <h2 className="headline-medium text-on-secondary-container">
                How BookHood supports your reading circle
              </h2>
              <ul className="space-y-[var(--spacing-7)]">
                {supportPoints.map((point) => (
                  <li
                    key={point}
                    className="body-medium flex items-start gap-[var(--spacing-5)] text-on-secondary-container"
                  >
                    <span
                      aria-hidden
                      className="inline-flex h-[var(--spacing-5)] w-[var(--spacing-5)] flex-shrink-0 translate-y-[var(--spacing-2)] rounded-full bg-primary"
                    />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="rounded-[var(--radius-lg)] border border-outline/60 bg-surface/90 p-[var(--spacing-8)] elevation-level1">
                <p className="label-medium text-on-surface-variant">Launch timeline</p>
                <p className="body-medium text-on-surface">
                  <strong className="font-semibold text-on-surface">Beta testing</strong> finishes this month. Store approvals follow immediately after. We will publish the direct download links here as soon as they are live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 translate-x-1/4 rounded-bl-[var(--radius-xl)] bg-primary/10 blur-3xl lg:block"
        aria-hidden
      />
    </header>
  );
}

const supportPoints = [
  "Match with nearby readers who share your genres.",
  "Track borrowed titles and due dates with gentle reminders.",
  "Build a trusted community library floor by floor.",
] as const;