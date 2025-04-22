"use client";

import { useProfile } from "@/hooks/useProfile";
import { ProfileLayout } from "@/components/pages/profile/ProfileLayout";

export function Profile({ isOwner, slug }: { isOwner: boolean; slug: string }) {
  const { data: profile } = useProfile(isOwner ? undefined : slug);

  return <ProfileLayout profile={profile} isOwner={isOwner} />;
}
