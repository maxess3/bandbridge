import { Providers } from "./providers";
import type { Metadata } from "next";

import { DM_Sans } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DM = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "bandbridge",
  description: "Connnecting talent, creating bands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${DM.className} antialiased`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
