import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../_components/legal-page";

const updatedAt = "May 27, 2026";

export const metadata: Metadata = {
  title: "Community Guidelines | BookHood",
  description: "Community standards for BookHood.",
};

const sections: readonly LegalSection[] = [
  {
    title: "Be Respectful",
    items: [
      "Treat other readers with respect, including people with different tastes, backgrounds, languages, and locations.",
      "Do not harass, threaten, bully, shame, stalk, or target another user.",
      "Do not post hateful, discriminatory, sexually exploitative, or violent content.",
    ],
  },
  {
    title: "Exchange Safely",
    items: [
      "Meet in public places and use in-app messaging until you are comfortable sharing other contact details.",
      "Do not pressure users to meet, reveal addresses, share phone numbers, or move conversations to another app.",
      "Report suspicious behavior, unsafe requests, impersonation, scams, or illegal listings.",
    ],
  },
  {
    title: "Keep Listings Honest",
    items: [
      "Describe book condition accurately.",
      "Use your own listing photos or photos you have permission to use.",
      "Do not list stolen, counterfeit, pirated, restricted, or illegal items.",
    ],
  },
  {
    title: "Protect Privacy",
    items: [
      "Do not post another person's private information.",
      "Do not share private messages outside BookHood to shame, threaten, or harass someone.",
      "Do not upload photos that expose addresses, phone numbers, payment details, or identity documents.",
    ],
  },
  {
    title: "Moderation",
    body: <p>BookHood may remove content, restrict features, suspend accounts, or delete accounts when community safety is at risk.</p>,
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage
      title="Community Guidelines"
      description="These rules help keep BookHood useful, respectful, and safe for local book exchanges."
      updatedAt={updatedAt}
      sections={sections}
    />
  );
}
