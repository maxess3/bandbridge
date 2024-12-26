export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex w-full min-h-[calc(100vh-133px)] my-8 items-center justify-center px-4 font-geist-sans">
			{children}
		</div>
	);
}
