import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../_components/legal-page";

const updatedAt = "May 27, 2026";

export const metadata: Metadata = {
  title: "Support | BookHood",
  description: "How to contact BookHood support.",
};

const sections: readonly LegalSection[] = [
  {
    title: "Contact Support",
    body: (
      <p>
        Email <a href="mailto:support@bookhood.app">support@bookhood.app</a>. We aim to respond within
        one business day during the MVP period.
      </p>
    ),
  },
  {
    title: "Include This Information",
    items: [
      "Your account email or username.",
      "The device model, operating system, and app version if the issue is technical.",
      "A short description of what happened and the time it happened.",
      "Screenshots only when they do not expose private messages, phone numbers, addresses, or payment details.",
    ],
  },
  {
    title: "Safety and Abuse",
    body: <p>For harassment, fraud, unsafe meetings, impersonation, illegal listings, or privacy issues, email <a href="mailto:safety@bookhood.app">safety@bookhood.app</a>.</p>,
  },
  {
    title: "Privacy and Deletion",
    body: <p>For privacy requests, email <a href="mailto:privacy@bookhood.app">privacy@bookhood.app</a>. To delete your account, use Settings &gt; Delete account in the app or visit the account deletion page.</p>,
  },
];

export default function SupportPage() {
  return (
    <LegalPage
      title="Support"
      description="Use this page to reach BookHood support, report safety issues, or request privacy help."
      updatedAt={updatedAt}
      sections={sections}
    />
  );
}
