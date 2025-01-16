import type { Metadata } from "next";
import {
  Schibsted_Grotesk,
  Exo_2,
  Inter,
  Andika,
  Hind_Guntur,
  Maven_Pro,
} from "next/font/google";

import "./globals.css";

import { Providers } from "./providers";
import AuthSessionProviders from "@/components/AuthSessionProviders";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MavenPro = Maven_Pro({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-exo",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Bandshake",
  description: "Connnecting talent, creating bands",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${MavenPro.className} antialiased min-h-screen flex flex-col`}
      >
        <AuthSessionProviders>
          <ReactQueryClientProvider>
            <Providers>
              <Toaster position="top-right" />
              <NextTopLoader color="#0a81ff" showSpinner={false} height={3} />
              <Navbar />
              <div className="px-10">
                <main className="container mx-auto flex-grow">{children}</main>
              </div>
              <Footer />
            </Providers>
          </ReactQueryClientProvider>
        </AuthSessionProviders>
      </body>
    </html>
  );
}
