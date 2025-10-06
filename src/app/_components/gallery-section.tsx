import Image from "next/image";

import { Container } from "./container";
import { MarqueeRail } from "./marquee-rail";

export type BookImage = {
  src: string;
  alt: string;
};

type GallerySectionProps = {
  images: readonly BookImage[];
};

export function GallerySection({ images }: GallerySectionProps) {
  return (
    <section className="bg-surface-variant py-[var(--spacing-12)] sm:py-[var(--spacing-14)]">
      <Container>
        <div className="flex flex-col gap-[var(--spacing-8)] sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-[var(--spacing-6)]">
            <p className="label-medium text-on-surface-variant">Discover real shelves</p>
            <h2 className="headline-medium text-on-surface">
              A living catalogue from your neighbours
            </h2>
            <p className="body-medium max-w-[min(60ch,var(--container-max-lg))] text-on-surface-variant">
              Browse photos shared by the community to see what is available right now. The carousel below pulls from trending swaps captured during our private beta.
            </p>
          </div>
        </div>
        <div className="mt-[var(--spacing-10)] overflow-hidden rounded-[var(--radius-xl)] border border-outline/40 bg-surface p-[var(--spacing-9)] elevation-level2">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)]">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-[var(--spacing-14)] bg-gradient-to-r from-surface via-surface/80 to-transparent" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-[var(--spacing-14)] bg-gradient-to-l from-surface via-surface/80 to-transparent" aria-hidden />
            <MarqueeRail
              items={images}
              duration="48s"
              gapVar="--spacing-10"
              renderItem={(item, index) => (
                <div
                  key={`${item.src}-${index}`}
                  className="relative flex-shrink-0 overflow-hidden rounded-[var(--radius-xl)] border border-outline/50 bg-surface elevation-level3"
                  style={{
                    height: "calc(var(--spacing-14) * 3.5)",
                    width: "calc(var(--spacing-14) * 2.7)",
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, 220px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}