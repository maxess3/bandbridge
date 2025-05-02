"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export function EditProfileGuard({ children }: { children: React.ReactNode }) {
	const params = useParams();
	const slug = params.slug as string;
	const { data: session } = useSession();

	if (session?.user?.username !== slug) {
		return null;
	}

	return <>{children}</>;
}
