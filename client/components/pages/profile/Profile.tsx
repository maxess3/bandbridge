"use client";

import { useProfile } from "@/hooks/useProfile";
import { ProfileLayout } from "@/components/pages/profile/ProfileLayout";
import { ProfileSkeleton } from "@/components/skeleton/profile/ProfileSkeleton";

export function Profile({ isOwner, slug }: { isOwner: boolean; slug: string }) {
	const { data: profile, isLoading } = useProfile(isOwner ? undefined : slug);

	if (isLoading) {
		return <ProfileSkeleton />;
	}

	return <ProfileLayout profile={profile} isOwner={isOwner} />;
}
