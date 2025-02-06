import type { Metadata } from "next";
import { Maven_Pro, DM_Sans } from "next/font/google";

import "./globals.css";

import { Providers } from "./providers";
import AuthSessionProviders from "@/components/AuthSessionProviders";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Navbar from "@/components/general/header/Navbar";
import Footer from "@/components/general/footer/Footer";

const MavenPro = Maven_Pro({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-maven",
  display: "swap",
  adjustFontFallback: false,
});

const DM = DM_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Rejoindre un groupe de musique",
  description: "Faites des rencontres et vivez la scène.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${MavenPro.variable} ${DM.className} antialiased min-h-screen flex flex-col`}
      >
        <AuthSessionProviders>
          <ReactQueryClientProvider>
            <Providers>
              <Toaster position="top-right" />
              <NextTopLoader color="#a8f906" showSpinner={false} height={3} />
              <div className="px-8">
                <Navbar />
                <main className="max-w-7xl mx-auto flex-grow">{children}</main>
                <Footer />
              </div>
              <div className="w-full py-0.5 bg-primary"></div>
            </Providers>
          </ReactQueryClientProvider>
        </AuthSessionProviders>
      </body>
    </html>
  );
}
