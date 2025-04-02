import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "@/providers/ThemeProviders";
import AuthSessionProviders from "@/providers/AuthSessionProviders";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Navbar from "@/components/general/header/Navbar";
import Footer from "@/components/general/footer/Footer";

const DM = DM_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: "Annonces - Chordeus",
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
        className={`${DM.className} antialiased min-h-screen flex flex-col`}
      >
        <AuthSessionProviders>
          <ReactQueryClientProvider>
            <ThemeProviders>
              <Toaster
                toastOptions={{
                  classNames: {
                    toast:
                      "bg-accent text-foreground border outline-none border-border text-sm",
                    error: "text-red-400",
                    success: "text-green-400",
                    warning: "text-yellow-400",
                    info: "bg-blue-400",
                    actionButton:
                      "!bg-transparent absolute right-1 !text-foreground",
                  },
                }}
                position="bottom-left"
                duration={4000}
              />
              <NextTopLoader color="#b9181b" showSpinner={false} height={3} />
              <div className="px-8">
                <Navbar />
                <main className="max-w-7xl mx-auto flex-grow">{children}</main>
                <Footer />
              </div>
              <div className="w-full py-0.5 bg-primary"></div>
            </ThemeProviders>
          </ReactQueryClientProvider>
        </AuthSessionProviders>
      </body>
    </html>
  );
}
