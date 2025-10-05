import Image from "next/image";

const BOOK_IMAGES = [
  {
    src: "/images/books/book-stack-1.jpg",
    alt: "Stack of well-loved novels with warm light at a neighborhood library table.",
  },
  {
    src: "/images/books/book-stack-2.jpg",
    alt: "Hardcover books with bright spines arranged beside a cup of tea.",
  },
  {
    src: "/images/books/book-stack-3.jpg",
    alt: "Reader browsing a collection of books in a cozy living room.",
  },
  {
    src: "/images/books/book-stack-4.jpg",
    alt: "Curated pile of books wrapped with twine on a wooden surface.",
  },
  {
    src: "/images/books/book-stack-5.jpg",
    alt: "Open book resting on a blanket beside glasses and soft lighting.",
  },
] as const;

const REVIEWS = [
  {
    quote:
      "BookHood helped me clear shelf space and discover new favourite authors from people just streets away.",
    name: "Layla M.",
    location: "Abu Dhabi, UAE",
  },
  {
    quote:
      "I finally met fellow mystery lovers in my neighbourhood. Swapping books has never felt safer or easier.",
    name: "Noura A.",
    location: "Dubai, UAE",
  },
  {
    quote:
      "We built a mini community library in our tower thanks to BookHood's match suggestions.",
    name: "Omar K.",
    location: "Sharjah, UAE",
  },
  {
    quote:
      "The wishlist feature keeps me organised and I always have a new read lined up for the weekend.",
    name: "Sara H.",
    location: "Al Ain, UAE",
  },
  {
    quote:
      "I love that I can trade children's books quickly as my kids outgrow them.",
    name: "Fatima R.",
    location: "Ras Al Khaimah, UAE",
  },
] as const;

const duplicatedBookImages = [...BOOK_IMAGES, ...BOOK_IMAGES];
const duplicatedReviews = [...REVIEWS, ...REVIEWS];

function StarRating() {
  return (
    <div className="flex items-center gap-1 text-warning" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className="h-4 w-4 fill-current"
          viewBox="0 0 20 20"
          focusable="false"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.122 3.45a1 1 0 00.95.69h3.63c.969 0 1.371 1.24.588 1.81l-2.938 2.135a1 1 0 00-.364 1.118l1.123 3.449c.3.921-.755 1.688-1.54 1.118l-2.939-2.135a1 1 0 00-1.175 0l-2.939 2.135c-.784.57-1.838-.197-1.539-1.118l1.122-3.449a1 1 0 00-.363-1.118L2.76 8.877c-.783-.57-.38-1.81.588-1.81h3.63a1 1 0 00.95-.69l1.121-3.45z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-surface text-on-surface">
      <header className="relative isolate overflow-hidden bg-surface">
        <div className="mx-auto w-full max-w-[var(--container-max-2xl)] px-[var(--container-padding-sm)] sm:px-[var(--container-padding-md)] lg:px-[var(--container-padding-lg)] py-12 lg:py-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center">
            <div className="space-y-7">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-container px-5 py-2 label-medium text-on-primary-container">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                App store launches coming soon
              </span>
              <h1 className="display-large max-w-xl text-balance text-on-surface">
                Trade stories, not just books.
              </h1>
              <p className="body-large max-w-xl text-on-surface-variant">
                BookHood connects nearby readers so you can swap, lend, or donate books without leaving your neighbourhood. We are finalising the iOS and Android releases -- check back soon or get notified when the app is live.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-4 text-on-primary title-medium shadow-sm transition ease-[var(--easing-emphasized)] hover:bg-inverse-primary hover:text-inverse-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  Notify me at launch
                </button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <span className="inline-flex items-center justify-center rounded-lg border border-outline/70 bg-surface px-6 py-4 text-on-surface title-medium opacity-70" aria-disabled>
                    App Store link pending
                  </span>
                  <span className="inline-flex items-center justify-center rounded-lg border border-outline/70 bg-surface px-6 py-4 text-on-surface title-medium opacity-70" aria-disabled>
                    Google Play link pending
                  </span>
                </div>
              </div>
              <p className="body-medium text-on-surface-variant">
                Add this page to your bookmarks and be the first to receive a download link. No spam, just books.
              </p>
            </div>
            <div className="rounded-xl bg-secondary-container/80 p-6 shadow-sm">
              <div className="space-y-5">
                <h2 className="headline-medium text-on-secondary-container">
                  How BookHood supports your reading circle
                </h2>
                <ul className="space-y-4">
                  <li className="body-medium flex items-start gap-3 text-on-secondary-container">
                    <span className="mt-[3px] inline-flex h-2.5 w-2.5 flex-shrink-0 translate-y-1 rounded-full bg-primary" aria-hidden />
                    Match with nearby readers who share your genres.
                  </li>
                  <li className="body-medium flex items-start gap-3 text-on-secondary-container">
                    <span className="mt-[3px] inline-flex h-2.5 w-2.5 flex-shrink-0 translate-y-1 rounded-full bg-primary" aria-hidden />
                    Track borrowed titles and due dates with gentle reminders.
                  </li>
                  <li className="body-medium flex items-start gap-3 text-on-secondary-container">
                    <span className="mt-[3px] inline-flex h-2.5 w-2.5 flex-shrink-0 translate-y-1 rounded-full bg-primary" aria-hidden />
                    Build a trusted community library floor by floor.
                  </li>
                </ul>
                <div className="rounded-xl border border-outline/60 bg-surface/90 p-5 shadow-sm">
                  <p className="label-medium text-on-surface-variant">Launch timeline</p>
                  <p className="body-medium text-on-surface">
                    <strong className="font-semibold text-on-surface">Beta testing</strong> finishes this month. Store approvals follow immediately after. We will publish the direct download links here as soon as they are live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 translate-x-1/4 rounded-bl-[var(--radius-xl)] bg-primary/10 blur-3xl lg:block"
          aria-hidden
        />
      </header>

      <section className="bg-surface-variant py-12 sm:py-14">
        <div className="mx-auto w-full max-w-[var(--container-max-2xl)] px-[var(--container-padding-sm)] sm:px-[var(--container-padding-md)] lg:px-[var(--container-padding-lg)]">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="label-medium text-on-surface-variant">Discover real shelves</p>
              <h2 className="headline-medium text-on-surface">
                A living catalogue from your neighbours
              </h2>
              <p className="body-medium max-w-2xl text-on-surface-variant">
                Browse photos shared by the community to see what is available right now. The carousel below pulls from trending swaps captured during our private beta.
              </p>
            </div>
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-outline/40 bg-surface p-6 shadow-sm">
            <div className="relative overflow-hidden rounded-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface via-surface/80 to-transparent" aria-hidden />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface via-surface/80 to-transparent" aria-hidden />
              <div className="flex w-max gap-8 animate-[gallery-scroll_48s_linear_infinite] motion-reduce:animate-none">
                {duplicatedBookImages.map((item, index) => (
                  <div
                    key={`${item.src}-${index}`}
                    className="relative h-[calc(var(--spacing-14)*3.5)] w-[calc(var(--spacing-14)*2.7)] flex-shrink-0 overflow-hidden rounded-xl border border-outline/50 bg-surface shadow-md"
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-12 sm:py-14">
        <div className="mx-auto w-full max-w-[var(--container-max-2xl)] px-[var(--container-padding-sm)] sm:px-[var(--container-padding-md)] lg:px-[var(--container-padding-lg)]">
          <div className="flex flex-col gap-4">
            <p className="label-medium text-on-surface-variant">Readers are ready</p>
            <h2 className="headline-medium text-on-surface">
              Early community feedback keeps us turning the page
            </h2>
          </div>
          <div className="mt-8 overflow-hidden">
            <div className="flex w-max gap-6 animate-[reviews-scroll_60s_linear_infinite] motion-reduce:animate-none">
              {duplicatedReviews.map((review, index) => (
                <article
                  key={`${review.name}-${index}`}
                  className="flex w-[min(18rem,calc(var(--spacing-14)*4.5))] flex-col gap-4 rounded-xl border border-outline/40 bg-secondary-container/50 p-6 text-on-secondary-container shadow-sm"
                >
                  <StarRating />
                  <p className="body-medium text-on-secondary-container">&ldquo;{review.quote}&rdquo;</p>
                  <div className="space-y-1">
                    <p className="title-medium text-on-secondary-container">{review.name}</p>
                    <p className="body-medium text-on-secondary-container/80">{review.location}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-secondary-container py-12">
        <div className="mx-auto w-full max-w-[var(--container-max-2xl)] px-[var(--container-padding-sm)] sm:px-[var(--container-padding-md)] lg:px-[var(--container-padding-lg)]">
          <div className="rounded-xl border border-outline/40 bg-surface p-8 text-on-surface shadow-sm sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <h2 className="headline-medium text-on-surface">
                  Link will appear here the moment stores approve us
                </h2>
                <p className="body-medium text-on-surface-variant">
                  Keep this tab handy or join the launch list so you are among the first to download BookHood.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-on-primary title-medium shadow-sm transition ease-[var(--easing-standard)] hover:bg-inverse-primary hover:text-inverse-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                Join the launch list
              </button>
            </div>
            <p className="body-medium mt-6 text-on-surface-variant">
              Questions? Email <a className="underline decoration-primary underline-offset-4" href="mailto:hello@bookhood.app">hello@bookhood.app</a> and we will reply within one business day.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}