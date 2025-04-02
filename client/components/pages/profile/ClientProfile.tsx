"use client";

import { useProfile } from "@/hooks/useProfile";
import { ProfileLayout } from "@/components/pages/profile";
import { ProfileSkeleton } from "@/components/skeleton/profile/ProfileSkeleton";

export function ClientProfile() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return <ProfileLayout profile={profile} />;
}
