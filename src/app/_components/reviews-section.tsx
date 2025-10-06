import type { CSSProperties } from "react";

import { Container } from "./container";
import { MarqueeRail } from "./marquee-rail";
import { StarRating } from "./star-rating";

export type Review = {
  quote: string;
  name: string;
  location: string;
};

type ReviewsSectionProps = {
  reviews: readonly Review[];
};

const reviewCardStyle = {
  "--review-card-min-height": "calc(var(--spacing-14) * 4.25)",
} as CSSProperties;

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="bg-surface py-[var(--spacing-12)] sm:py-[var(--spacing-14)]">
      <Container>
        <div className="flex flex-col gap-[var(--spacing-5)]">
          <p className="label-medium text-on-surface-variant">Readers are ready</p>
          <h2 className="headline-medium text-on-surface">
            Early community feedback keeps us turning the page
          </h2>
        </div>
        <div className="mt-[var(--spacing-10)] overflow-hidden">
          <MarqueeRail
            items={reviews}
            duration="60s"
            gapVar="--spacing-9"
            renderItem={(review, index) => (
              <article
                key={`${review.name}-${index}`}
                style={reviewCardStyle}
                className="grid min-h-[var(--review-card-min-height)] w-[min(18rem,calc(var(--spacing-14)*4.5))] grid-rows-[auto_1fr_auto] gap-[var(--spacing-5)] rounded-[var(--radius-xl)] border border-outline/40 bg-secondary-container/50 p-[var(--spacing-9)] text-on-secondary-container elevation-level1"
              >
                <StarRating />
                <blockquote className="body-medium text-on-secondary-container m-0">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <footer className="space-y-[var(--spacing-2)]">
                  <p className="title-medium text-on-secondary-container">{review.name}</p>
                  <p className="body-medium text-on-secondary-container/80">{review.location}</p>
                </footer>
              </article>
            )}
          />
        </div>
      </Container>
    </section>
  );
}
