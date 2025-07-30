import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProviders } from "@/providers/ThemeProviders";
import AuthSessionProviders from "@/providers/AuthSessionProviders";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { SidebarAuth } from "@/components/features/auth/sidebar/SidebarAuth";
import { FocusManagerProvider } from "@/contexts/FocusManagerContext";

const newKansas = localFont({
  src: [
    {
      path: "../public/fonts/NewKansas/NewKansas-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/NewKansas/NewKansas-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NewKansas/NewKansas.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NewKansas/NewKansas-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/NewKansas/NewKansas-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/NewKansas/NewKansas-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NewKansas/NewKansas-Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/NewKansas/NewKansas-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-new-kansas",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
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
        className={`${nunitoSans.className} nunito-adjusted ${newKansas.variable} antialiased min-h-screen flex flex-col bg-[#040404]`}
      >
        <ThemeProviders>
          <AuthSessionProviders>
            <ReactQueryClientProvider>
              <FocusManagerProvider>
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
                  offset={10}
                  duration={3000}
                />
                <TooltipProvider>
                  <SidebarProvider>
                    <SidebarAuth />
                    <SidebarInset>
                      <ConditionalLayout>{children}</ConditionalLayout>
                    </SidebarInset>
                  </SidebarProvider>
                </TooltipProvider>
              </FocusManagerProvider>
            </ReactQueryClientProvider>
          </AuthSessionProviders>
        </ThemeProviders>
      </body>
    </html>
  );
}
