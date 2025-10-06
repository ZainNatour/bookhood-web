import type { BookImage } from "./_components/gallery-section";
import { HomePage } from "./_components/home-page";
import type { Review } from "./_components/reviews-section";

const bookImages: readonly BookImage[] = [
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
];

const reviews: readonly Review[] = [
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
];

export default function Home() {
  return <HomePage bookImages={bookImages} reviews={reviews} />;
}