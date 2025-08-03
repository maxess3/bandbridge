"use client";

import { FollowButton } from "@/components/features/profile/buttons/FollowButton";
import { useSession } from "next-auth/react";

export const ProfileTopActions = ({ username }: { username: string }) => {
	const { data: session } = useSession();

	if (!session?.user) return null;

	return <FollowButton username={username} />;
};
