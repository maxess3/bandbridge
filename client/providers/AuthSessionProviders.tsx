"use client";

// import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
// import { LoadingSpinner } from "@/components/loader/LoadingSpinner";

type SessionProps = {
	children: React.ReactNode;
};

function SessionLoader({ children }: { children: React.ReactNode }) {
	// const { status } = useSession();

	// if (status === "loading") {
	// 	return <LoadingSpinner />;
	// }

	return <>{children}</>;
}

export default function AuthSessionProviders({ children }: SessionProps) {
	return (
		<SessionProvider>
			<SessionLoader>{children}</SessionLoader>
		</SessionProvider>
	);
}
