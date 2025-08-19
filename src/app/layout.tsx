import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "@/store/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resume Oracle - Discover Skills You Forgot You Had",
  description: "Stop losing jobs to incomplete resumes. AI finds hidden skills in your experience and creates targeted resumes that get noticed. No signup required, privacy-first.",

  // Open Graph
  openGraph: {
    title: "Resume Oracle - Discover Skills You Forgot You Had",
    description: "Stop losing jobs to incomplete resumes. AI finds hidden skills and creates targeted resumes that get interviews. No signup required.",
    url: "https://resumeoracle.app",
    siteName: "Resume Oracle",
    images: [
      {
        url: "https://resumeoracle.app/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Resume Oracle - Discover Skills You Forgot You Had",
      },
    ],
    locale: "en_US",
    type: "website",
  },  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "Resume Oracle - Discover Skills You Forgot You Had",
    description: "Stop losing jobs to incomplete resumes. AI finds hidden skills in your experience and creates targeted resumes that get noticed.",
    images: [
      { 
        url: "https://resumeoracle.app/og-image.svg", 
        width: 1200, 
        height: 675, 
        alt: "Resume Oracle - Discover Skills You Forgot You Had" 
      },
    ],
    creator: "@resumeoracle",
  },

  // Additional meta
  keywords: ["resume builder", "AI resume", "job application", "career tools", "resume optimization", "skills discovery"],
  authors: [{ name: "Resume Oracle" }],
  creator: "Resume Oracle",
  publisher: "Resume Oracle",

  // Verification and robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
