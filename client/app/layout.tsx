import { Providers } from "./providers";
import type { Metadata } from "next";

import { Host_Grotesk } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

import Navbar from "@/components/Navbar";

const hostGrotesk = Host_Grotesk({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  display: "swap",
  adjustFontFallback: false,
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bandbridge",
  description: "Bandbridge description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${hostGrotesk.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="container mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
