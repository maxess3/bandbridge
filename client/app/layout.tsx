import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "@/providers/ThemeProviders";
import AuthSessionProviders from "@/providers/AuthSessionProviders";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import Navbar from "@/components/general/header/Navbar";
import Footer from "@/components/general/footer/Footer";

// const NewKansas = localFont({
//   src: [
//     {
//       path: "../public/fonts/NewKansas/New Kansas Regular.otf",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/NewKansas/New Kansas Medium.otf",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/NewKansas/New Kansas SemiBold.otf",
//       weight: "600",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/NewKansas/New Kansas Bold.otf",
//       weight: "700",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/NewKansas/New Kansas Heavy.otf",
//       weight: "800",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/NewKansas/New Kansas Black.otf",
//       weight: "900",
//       style: "normal",
//     },
//   ],
//   variable: "--font-new-kansas",
// });

const Satoshi = localFont({
  src: "../public/fonts/Satoshi/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});

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
        className={`${DM.className} ${Satoshi.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProviders>
          <AuthSessionProviders>
            <ReactQueryClientProvider>
              <Toaster
                toastOptions={{
                  classNames: {
                    toast:
                      "bg-background border border-border-light text-foreground text-sm shadow-xl [&>div>[data-title]]:opacity-90 [&>div>[data-title]]:font-normal",
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
                duration={100000}
              />
              <NextTopLoader color="#b9181b" showSpinner={false} height={3} />
              <div className="px-8">
                <Navbar />
                <main className="max-w-7xl mx-auto flex-grow">{children}</main>
                <Footer />
              </div>
              <div className="w-full py-0.5 bg-primary"></div>
            </ReactQueryClientProvider>
          </AuthSessionProviders>
        </ThemeProviders>
      </body>
    </html>
  );
}
