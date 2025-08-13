import type { Metadata } from "next";
import { Poppins } from "next/font/google";
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
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { headers } from "next/headers";
import { isPublicRoute } from "@/utils/utils";

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
				className={`${poppins.className} antialiased min-h-screen flex flex-col bg-[#040404]`}
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
										{!isPublic && <SidebarAuth />}
										<SidebarInset>
											<ConditionalLayout isPublic={isPublic}>
												{children}
											</ConditionalLayout>
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
