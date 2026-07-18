import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../_components/legal-page";

const updatedAt = "May 27, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy | BookHood",
  description: "How BookHood collects, uses, shares, and protects personal data.",
};

const sections: readonly LegalSection[] = [
  {
    title: "Who We Are",
    body: (
      <>
        <p>
          BookHood is a community app for discovering, listing, exchanging, and discussing books with
          nearby readers.
        </p>
        <p>
          Contact us at <a href="mailto:privacy@bookhood.app">privacy@bookhood.app</a> for privacy
          questions and at <a href="mailto:support@bookhood.app">support@bookhood.app</a> for support.
        </p>
      </>
    ),
  },
  {
    title: "Personal Data We Collect",
    items: [
      "Account data, such as email address, username, display name, password authentication status, phone number when provided, and linked sign-in provider identifiers.",
      "Profile and community data, such as avatar, bio, preferred languages, genres, posts, reviews, comments, follows, blocks, and moderation reports.",
      "Book and exchange data, such as book listings, availability, wishlists, reviews, exchange requests, messages, proposed meeting details, and pickup-location choices.",
      "Location data you choose to provide, such as city, area, approximate home location, preferred exchange radius, and privacy-preserving map precision settings.",
      "Contacts data only when you explicitly opt in. Contacts are normalized and hashed before upload for matching; raw device contacts are not stored by BookHood.",
      "Photos and media that you upload for profiles, posts, listings, or support requests.",
      "Device, diagnostics, and security data, such as IP address, device type, app version, push token, crash reports, request logs, abuse-prevention events, and authentication session metadata.",
    ],
  },
  {
    title: "Book Scanning and OCR",
    items: [
      "For the MVP release, server-side OCR, cloud OCR, and server shelf-scanning workers are disabled.",
      "On-device scanning can process camera frames locally to detect barcodes or text. This processing stays on the device unless you explicitly upload a photo as part of another feature.",
      "If server-side shelf scanning or cloud OCR is introduced later, this policy and the in-app disclosures must be updated before activation.",
    ],
  },
  {
    title: "How We Use Data",
    items: [
      "Create and secure your account.",
      "Show profiles, listings, reviews, posts, messages, exchange requests, and notifications.",
      "Suggest relevant books, readers, communities, and nearby exchange opportunities.",
      "Moderate content, investigate abuse, prevent fraud, and enforce our terms.",
      "Provide support, troubleshoot errors, and improve reliability and safety.",
      "Comply with law, store obligations, and lawful requests.",
    ],
  },
  {
    title: "Sharing",
    items: [
      "Other users can see the profile, listings, posts, reviews, comments, and exchange details you choose to make visible.",
      "Service providers may process data for hosting, storage, email, SMS, push notifications, analytics, crash reporting, security, and support.",
      "We may disclose data when required by law, to protect users, to investigate abuse, or as part of a business transfer.",
      "We do not sell personal data.",
    ],
  },
  {
    title: "Russia Launch and Data Residency",
    body: (
      <p>
        For a Russia launch, primary account, profile, community, exchange, and uploaded-media data
        for Russian users should be hosted in Russia. Any cross-border transfer to providers such as
        analytics, crash reporting, email, push notifications, or support tools must be reviewed,
        disclosed, and configured only when lawful.
      </p>
    ),
  },
  {
    title: "Retention and Deletion",
    items: [
      "We keep account data while your account is active and as needed for safety, legal, audit, fraud-prevention, and dispute-resolution purposes.",
      "When you delete your account, direct account identifiers are removed or anonymized and active sessions are revoked. Some historical records may be retained in anonymized or integrity-preserving form where needed for safety, legal, or audit obligations.",
      "You can start deletion in the app from Settings > Delete account, or use the account deletion page.",
    ],
  },
  {
    title: "Your Choices",
    items: [
      "You can edit profile data in the app.",
      "You can control location precision and visibility settings.",
      "You can withdraw contact matching consent.",
      "You can opt out of non-essential notifications in device settings or in-app settings where available.",
      "You can request access, correction, deletion, or support by emailing privacy@bookhood.app.",
    ],
  },
  {
    title: "Children",
    body: <p>BookHood is not intended for children under 13. If you believe a child provided personal data, contact us so we can review and remove it.</p>,
  },
  {
    title: "Changes",
    body: <p>We will update this page when our data practices change. Material changes may also be announced in the app or by email.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains what BookHood collects, how it is used, how it is shared, and how users can control or delete their data."
      updatedAt={updatedAt}
      sections={sections}
    />
  );
}
