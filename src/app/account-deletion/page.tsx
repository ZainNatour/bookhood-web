import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../_components/legal-page";

const updatedAt = "May 27, 2026";

export const metadata: Metadata = {
  title: "Account Deletion | BookHood",
  description: "How to delete a BookHood account and associated data.",
};

const sections: readonly LegalSection[] = [
  {
    title: "Delete In The App",
    items: [
      "Open BookHood while signed in.",
      "Go to Settings.",
      "Choose Delete account.",
      "Confirm deletion. Password accounts may be asked for the current password; linked-provider-only accounts can confirm deletion from an authenticated session.",
    ],
  },
  {
    title: "Request Deletion By Email",
    body: (
      <p>
        If you cannot access the app, email <a href="mailto:privacy@bookhood.app">privacy@bookhood.app</a>
        from the email address on your account with the subject Account deletion request. We may ask for
        verification before deleting the account.
      </p>
    ),
  },
  {
    title: "What Is Deleted Or Anonymized",
    items: [
      "Direct account identifiers, such as email address, username, phone number, linked sign-in records, active sessions, push tokens, and verification tokens.",
      "Profile details, private settings, recommendation preferences, watchlist entries, notifications, saved locations, and scan job records tied directly to the account.",
      "Public profile details are replaced with a deleted-user placeholder where records must remain for integrity or safety.",
    ],
  },
  {
    title: "What May Be Retained",
    items: [
      "Records needed for security, fraud prevention, legal compliance, audit integrity, dispute handling, or enforcement of safety rules.",
      "Historical exchange records, moderation records, and audit logs in limited or anonymized form when deletion would compromise user safety or system integrity.",
      "Backups for a limited period until they expire through normal backup rotation.",
    ],
  },
  {
    title: "Timing",
    body: <p>In-app deletion starts immediately. Email requests are handled after verification. Backup copies expire through normal retention schedules.</p>,
  },
];

export default function AccountDeletionPage() {
  return (
    <LegalPage
      title="Account Deletion"
      description="BookHood users can delete their account in the app or request deletion by email if they cannot sign in."
      updatedAt={updatedAt}
      sections={sections}
    />
  );
}
