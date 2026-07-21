import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/app/providers";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "Jack -- 3D Creator",
  description: "A 3D creator driven by crafting striking and unforgettable projects.",
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
