import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../_components/legal-page";

const updatedAt = "May 27, 2026";

export const metadata: Metadata = {
  title: "Terms of Service | BookHood",
  description: "Rules for using BookHood.",
};

const sections: readonly LegalSection[] = [
  {
    title: "Agreement",
    body: <p>By using BookHood, you agree to these terms, the Privacy Policy, the Community Guidelines, and the Content Policy.</p>,
  },
  {
    title: "Accounts",
    items: [
      "You must provide accurate account information and keep your login credentials secure.",
      "You are responsible for activity under your account unless you report unauthorized access promptly.",
      "You may delete your account from Settings > Delete account or through the account deletion page.",
    ],
  },
  {
    title: "Book Exchanges",
    items: [
      "BookHood helps readers discover and coordinate book exchanges, but users are responsible for their own listings, messages, meetings, and exchanges.",
      "Do not list counterfeit, pirated, stolen, unsafe, illegal, or restricted items.",
      "Meet in safe public places when exchanging books and do not share sensitive personal information unless necessary.",
    ],
  },
  {
    title: "User Content",
    items: [
      "You keep ownership of content you post, such as reviews, photos, listings, comments, and profile information.",
      "You grant BookHood a worldwide, non-exclusive license to host, display, moderate, and process your content to operate and improve the service.",
      "You must have the rights needed to upload or post your content.",
    ],
  },
  {
    title: "Prohibited Conduct",
    items: [
      "Do not harass, threaten, discriminate against, impersonate, scam, or exploit other users.",
      "Do not scrape, attack, reverse engineer, overload, or bypass security controls.",
      "Do not use BookHood for spam, fraud, illegal activity, or commercial activity that is not authorized by BookHood.",
      "Do not upload malware, private data of others, or content that violates the Content Policy.",
    ],
  },
  {
    title: "Moderation",
    body: <p>We may remove content, restrict features, suspend accounts, or delete accounts when we believe these terms or safety policies have been violated.</p>,
  },
  {
    title: "Availability",
    body: <p>BookHood may change, pause, or discontinue features. MVP features can change quickly as we improve reliability, safety, and cost controls.</p>,
  },
  {
    title: "Disclaimers",
    body: <p>BookHood is provided as is and as available. We do not guarantee that every listing, recommendation, exchange, user, or message is accurate, safe, available, or error-free.</p>,
  },
  {
    title: "Contact",
    body: <p>Questions about these terms can be sent to <a href="mailto:legal@bookhood.app">legal@bookhood.app</a>.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms define the rules for using BookHood and participating in the book-exchange community."
      updatedAt={updatedAt}
      sections={sections}
    />
  );
}
