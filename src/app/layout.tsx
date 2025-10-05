import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BookHood | Swap Books, Grow Community",
  description:
    "Discover nearby readers, swap books, and build your local library with the upcoming BookHood app.",
  keywords: [
    "bookhood",
    "book exchange",
    "reading community",
    "local books",
  ],
  authors: [{ name: "BookHood" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-surface text-on-surface">
      <body className={`${inter.variable} antialiased font-sans bg-surface text-on-surface`}>
        {children}
      </body>
    </html>
  );
}