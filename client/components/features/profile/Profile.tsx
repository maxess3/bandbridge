"use client";

import { useProfile } from "@/hooks/useProfile";
import { ProfileLayout } from "@/components/features/profile/ProfileLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export function Profile({ isOwner, slug }: { isOwner: boolean; slug: string }) {
  const { data: profile } = useProfile(isOwner ? undefined : slug);
  const router = useRouter();

  useEffect(() => {
    // If the user is the owner of the profile and the username !== slug, redirect to the user's own profile
    if (isOwner && profile?.username !== slug) {
      console.log("Refresh profile");
      router.refresh();
    }
  }, [isOwner, profile?.username, slug, router]);

  return <ProfileLayout profile={profile} isOwner={isOwner} />;
}
