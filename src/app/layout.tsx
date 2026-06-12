import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChrisBuilds | Award-Winning Creative Agency & Digital Studio",
  description: "We design digital experiences that people remember. Premium custom websites, mobile apps, and digital products crafted for ambitious brands.",
  keywords: ["ChrisBuilds", "creative agency", "design studio", "digital products", "Awwwards design", "Three.js spline", "Stripe design", "next.js portfolio"],
  authors: [{ name: "Chris" }],
  openGraph: {
    title: "ChrisBuilds | Award-Winning Creative Agency & Digital Studio",
    description: "We design digital experiences that people remember. Premium custom websites, mobile apps, and digital products.",
    url: "https://chrisbuilds.com",
    siteName: "ChrisBuilds",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChrisBuilds | Award-Winning Creative Agency & Digital Studio",
    description: "We design digital experiences that people remember.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bright-sky text-slate-800 selection:bg-primary-pink/10 selection:text-[#d9006c] relative overflow-x-hidden">
        {/* Ambient Fluid Sky & Cloud Backgrounds */}
        <div className="fluid-bg-transition" />
        <div className="cloud-drift-bg" />
        <div className="fluid-blob-1" />
        <div className="fluid-blob-2" />
        <div className="fluid-blob-3" />
        {children}
      </body>
    </html>
  );
}

