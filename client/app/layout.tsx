import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "@/providers/ThemeProviders";
import AuthSessionProviders from "@/providers/AuthSessionProviders";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/general/header/Navbar";
import Footer from "@/components/general/footer/Footer";

const DM = DM_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: "Chordeus - La musique qui vous rassemble",
  description:
    "Faites de nouvelles rencontres, créez des groupes, et partagez vos musiques.",
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
        <ThemeProviders>
          <AuthSessionProviders>
            <ReactQueryClientProvider>
              <Toaster
                toastOptions={{
                  classNames: {
                    toast:
                      "bg-background border border-border text-foreground text-sm shadow-xl [&>div>[data-title]]:opacity-90 [&>div>[data-title]]:font-normal",
                    error:
                      "[&>div>svg]:text-red-700 dark:[&>div>svg]:text-red-600",
                    success:
                      "[&>div>svg]:text-green-700 dark:[&>div>svg]:text-green-600",
                    warning:
                      "[&>div>svg]:text-orange-700 dark:[&>div>svg]:text-orange-600",
                    info: "[&>div>svg]:text-blue-700 dark:[&>div>svg]:text-blue-600",
                    actionButton:
                      "!bg-transparent absolute right-1 !text-foreground",
                    icon: "[&>svg]:w-6 [&>svg]:h-6 mr-2",
                  },
                }}
                position="bottom-left"
                duration={4000}
              />
              <NextTopLoader color="#b9181b" showSpinner={false} height={3} />
              <TooltipProvider>
                <div>
                  <Navbar />
                  <main className="max-w-[1240px] mx-auto px-4">
                    {children}
                  </main>
                  <Footer />
                </div>
              </TooltipProvider>
              <div className="w-full py-0.5 bg-primary"></div>
            </ReactQueryClientProvider>
          </AuthSessionProviders>
        </ThemeProviders>
      </body>
    </html>
  );
}
