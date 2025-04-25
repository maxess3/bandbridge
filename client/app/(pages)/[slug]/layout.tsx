import { Metadata } from "next";

interface LayoutProps {
	modal: React.ReactNode;
	children: React.ReactNode;
}

export const metadata: Metadata = {
	title: "Profil | Chordeus",
	description: "Découvrez les profils des musiciens sur Chordeus",
};

export default async function Layout({ modal, children }: LayoutProps) {
	return (
		<div>
			<main>
				{modal}
				{children}
			</main>
		</div>
	);
}
