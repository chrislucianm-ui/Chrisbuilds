import type { Metadata } from "next";
import { Geist, Geist_Mono, Pinyon_Script, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "ChrisBuilds | Creative Systems & Dynamic Web Engineering",
  description: "Bespoke digital portfolios, Next.js web applications, and custom software systems crafted with minimalist precision.",
  keywords: ["ChrisBuilds", "minimalist portfolio", "Next.js", "React", "TypeScript", "Tailwind CSS", "Awwwards design"],
  authors: [{ name: "Chris" }],
  openGraph: {
    title: "ChrisBuilds | Creative Systems & Dynamic Web Engineering",
    description: "Bespoke digital portfolios, Next.js web applications, and custom software systems.",
    url: "https://chrisbuilds.com",
    siteName: "ChrisBuilds",
    locale: "en_US",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white selection:bg-white/10 selection:text-white relative overflow-x-hidden">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
