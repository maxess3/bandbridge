"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/loader/LoadingSpinner";
import { useState, useEffect } from "react";

type SessionProps = {
	children: React.ReactNode;
};

function SessionLoader({ children }: { children: React.ReactNode }) {
	const { status } = useSession();
	const [isLoading, setIsLoading] = useState(true);

	// Fake delay to show the loading spinner for 1 second
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 0);

		return () => clearTimeout(timer);
	}, []);

	// If the status is loading or the fake delay is not over, show the loading spinner
	if (status === "loading" || isLoading) {
		return <LoadingSpinner />;
	}

	return <>{children}</>;
}

export default function AuthSessionProviders({ children }: SessionProps) {
	return (
		<SessionProvider>
			<SessionLoader>{children}</SessionLoader>
		</SessionProvider>
	);
}
