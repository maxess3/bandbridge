interface LayoutProps {
	modal: React.ReactNode;
	children: React.ReactNode;
}

export default async function Layout({ modal, children }: LayoutProps) {
	return (
		<>
			{modal}
			{children}
		</>
	);
}
