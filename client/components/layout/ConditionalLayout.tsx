import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { headers } from "next/headers";
import Navbar from "@/components/layout/header/Navbar";
import { NavbarAuth } from "@/components/features/auth/navbar/NavbarAuth";
import Footer from "@/components/layout/footer/Footer";
import { isPublicRoute } from "@/utils/utils";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

export async function ConditionalLayout({ children }: ConditionalLayoutProps) {
	const session = await getServerSession(authOptions);
	const headersList = await headers();
	const pathname = headersList.get("x-current-path") || "";

	// Si l'utilisateur n'est pas connecté OU si c'est une route publique, afficher navbar + footer
	if (!session?.user || isPublicRoute(pathname)) {
		return (
			<div className="w-full mx-auto">
				<Navbar />
				<main className="max-w-7xl mx-auto lg:p-6 md:p-4 p-2">{children}</main>
				<Footer />
			</div>
		);
	}

	// Si l'utilisateur est connecté et ce n'est pas une route publique, afficher navbar authentifiée + contenu
	return (
		<div className="w-full mx-auto">
			<NavbarAuth />
			<main className="max-w-7xl mx-auto lg:p-6 md:p-4 p-2">{children}</main>
		</div>
	);
}
