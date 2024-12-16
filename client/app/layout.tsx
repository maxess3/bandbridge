import { Providers } from "./providers";
import type { Metadata } from "next";

import NextTopLoader from "nextjs-toploader";

import { DM_Sans } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DM = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
      <body
        className={`${DM.className} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <NextTopLoader color="#0a81ff" showSpinner={false} height={3} />
          <Navbar />
          <div className="px-10">
            <main className="container mx-auto flex-grow">{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
