import { headers } from "next/headers";

interface LayoutProps {
	modal: React.ReactNode;
	children: React.ReactNode;
}

export default async function Layout({ modal, children }: LayoutProps) {
	// Vérifier si on est sur la page de profil principale (pas /[slug]/edit, etc.)
	const headersList = await headers();
	const pathname = headersList.get("x-current-path") || "";
	const isProfileMainPage = pathname.split('/').filter(Boolean).length === 1;

	return (
		<div data-disable-padding={isProfileMainPage ? "true" : "false"}>
			{modal}
			{children}
		</div>
	);
}
