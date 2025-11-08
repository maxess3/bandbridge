import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProviders } from "@/providers/ThemeProviders";
import AuthSessionProviders from "@/providers/AuthSessionProviders";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { FocusManagerProvider } from "@/contexts/FocusManagerContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { headers } from "next/headers";
import { isPublicRoute } from "@/utils";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Chordeus - La musique qui nous rassemble",
  description:
    "Faites de nouvelles rencontres, créez des groupes et jouez ensemble !",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  const pathname = headersList.get("x-current-path") || "";
  const isPublic = !session?.user || isPublicRoute(pathname);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProviders>
          <AuthSessionProviders>
            <ReactQueryClientProvider>
              <FocusManagerProvider>
                <Toaster
                  toastOptions={{
                    classNames: {
                      toast:
                        "bg-background border border-border text-foreground text-sm shadow-xl [&>div>[data-title]]:opacity-90 [&>div>[data-title]]:font-normal right-0",
                      error:
                        "[&>div>svg]:text-red-700 dark:[&>div>svg]:text-red-600",
                      success:
                        "[&>div>svg]:text-green-700 dark:[&>div>svg]:text-green-600",
                      warning:
                        "[&>div>svg]:text-orange-700 dark:[&>div>svg]:text-orange-600",
                      info: "[&>div>svg]:text-blue-700 dark:[&>div>svg]:text-blue-600",
                      actionButton:
                        "bg-transparent! absolute right-1 text-foreground!",
                      icon: "[&>svg]:w-6 [&>svg]:h-6 mr-2",
                    },
                  }}
                  position="top-right"
                  offset={80}
                  duration={3000}
                />
                <TooltipProvider>
                  <ConditionalLayout isPublic={isPublic}>
                    {children}
                  </ConditionalLayout>
                </TooltipProvider>
              </FocusManagerProvider>
            </ReactQueryClientProvider>
          </AuthSessionProviders>
        </ThemeProviders>
      </body>
    </html>
  );
}
