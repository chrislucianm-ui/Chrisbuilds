import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/app/providers";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-kanit",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Chris Builds | Premium Digital Experiences",
  description:
    "Chris Builds crafts immersive, luxury-inspired websites and digital experiences with premium animations and modern design.",
  keywords: [
    "Chris Builds",
    "ChrisBuilds",
    "Luxury Digital Experiences",
    "Creative Systems",
    "Next.js",
    "Web Engineering",
    "Awwwards Portfolio",
  ],
  authors: [{ name: "Chris" }],
  openGraph: {
    title: "Chris Builds | Premium Digital Experiences",
    description: "Building immersive and premium digital experiences.",
    url: "https://chrisbuilds.dev",
    siteName: "Chris Builds",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chris Builds | Premium Digital Experiences",
    description: "Building immersive and premium digital experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kanit.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0C0C0C] text-[#D7E2EA] selection:bg-white/10 selection:text-white relative overflow-x-clip font-sans">
        <div id="root" className="bg-[#0C0C0C] min-h-full overflow-x-clip">
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </div>
      </body>
    </html>
  );
}
