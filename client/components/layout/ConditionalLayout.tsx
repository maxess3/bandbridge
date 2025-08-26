import Navbar from "@/components/layout/header/Navbar";
import { NavbarAuth } from "@/components/features/auth/navbar/NavbarAuth";
import Footer from "@/components/layout/footer/Footer";

interface ConditionalLayoutProps {
	children: React.ReactNode;
	isPublic: boolean;
}

export async function ConditionalLayout({
	children,
	isPublic,
}: ConditionalLayoutProps) {
	// Si l'utilisateur n'est pas connecté OU si c'est une route publique, afficher navbar + footer
	if (isPublic) {
		return (
			<div className="w-full mx-auto">
				<Navbar />
				<main className="max-w-7xl mx-auto">{children}</main>
				<Footer />
			</div>
		);
	}

	// Si l'utilisateur est connecté et ce n'est pas une route publique, afficher navbar authentifiée + contenu
	return (
		<div className="w-full mx-auto">
			<NavbarAuth />
			<main className="max-w-7xl mx-auto">{children}</main>
		</div>
	);
}
