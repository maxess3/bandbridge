"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";

export function ProfileEditGuard({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const router = useRouter();
  const { data: profile } = useProfile();

  useEffect(() => {
    // If the user is the owner of the profile and the username !== slug, redirect to the user's own profile
    if (profile?.username !== slug) {
      router.refresh();
    }
  }, [profile?.username, slug, router]);

  return <>{children}</>;
}
