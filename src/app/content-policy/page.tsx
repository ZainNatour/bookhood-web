import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "../_components/legal-page";

const updatedAt = "May 27, 2026";

export const metadata: Metadata = {
  title: "Content Policy | BookHood",
  description: "Rules for content uploaded or posted on BookHood.",
};

const sections: readonly LegalSection[] = [
  {
    title: "Allowed Content",
    items: [
      "Book listings, book photos, reviews, recommendations, comments, profile details, and community posts related to reading or book exchange.",
      "Original photos or text you created, or content you have permission to use.",
      "Fair, honest opinions about books, exchange experiences, and community activity.",
    ],
  },
  {
    title: "Restricted Content",
    items: [
      "Illegal, stolen, counterfeit, pirated, or rights-infringing books or files.",
      "Harassment, threats, hate, exploitation, sexual content involving minors, graphic violence, or instructions for harm.",
      "Spam, scams, phishing, malware, misleading links, fake giveaways, or fraudulent listings.",
      "Private information, identity documents, financial details, addresses, or private messages posted without permission.",
      "Commercial advertising or bulk promotion that BookHood has not approved.",
    ],
  },
  {
    title: "Photos and Scans",
    items: [
      "Photos should show the listed book or relevant reading/community content.",
      "Do not upload photos that reveal private addresses, phone numbers, payment cards, documents, or unrelated people without consent.",
      "Server-side OCR and server shelf scanning are disabled for the MVP release; this policy must be updated before those server features are activated.",
    ],
  },
  {
    title: "Intellectual Property",
    body: <p>Only upload content you own or are allowed to use. Rights owners can report concerns at <a href="mailto:legal@bookhood.app">legal@bookhood.app</a>.</p>,
  },
  {
    title: "Enforcement",
    body: <p>We may remove content, limit distribution, restrict features, suspend accounts, or preserve evidence when needed for safety, legal compliance, or abuse investigation.</p>,
  },
];

export default function ContentPolicyPage() {
  return (
    <LegalPage
      title="Content Policy"
      description="This policy explains what users can and cannot post, upload, list, or share on BookHood."
      updatedAt={updatedAt}
      sections={sections}
    />
  );
}
