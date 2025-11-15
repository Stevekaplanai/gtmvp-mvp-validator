import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GTMVP MVP Validator | AI-Powered Idea Validation",
  description: "Validate your MVP idea with AI-powered market research, competition analysis, and technical feasibility assessment. Get a deterministic score in minutes.",
  keywords: ["MVP", "validation", "startup", "market research", "AI", "GTMVP"],
  authors: [{ name: "GTMVP", url: "https://gtmvp.com" }],
  openGraph: {
    title: "GTMVP MVP Validator",
    description: "AI-powered MVP validation in minutes",
    url: "https://mvp.gtmvp.com",
    siteName: "GTMVP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
