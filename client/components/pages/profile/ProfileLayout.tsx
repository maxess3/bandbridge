"use client";

import {
  ProfileImage,
  ProfileHeader,
  ProfileInfo,
  ProfileDetails,
  ProfileSidebar,
} from "@/components/pages/profile/index";
import { ProfileProvider } from "@/providers/ProfileProvider";
import { Profile } from "@/types/Profile";

interface ProfileLayoutProps {
  isPublic?: boolean;
  profile: Profile;
}

export function ProfileLayout({
  isPublic = false,
  profile,
}: ProfileLayoutProps) {
  return (
    <ProfileProvider isPublic={isPublic} profile={profile}>
      <div className="py-8 flex flex-col w-full">
        <div className="w-full flex gap-x-4">
          <div className="w-9/12">
            <div className="flex gap-x-8 w-full">
              <div className="flex items-center">
                <ProfileImage src="/profile.jpeg" alt="Photo de profil" />
              </div>
              <div className="flex flex-col w-full">
                <ProfileHeader />
                <ProfileInfo />
                <ProfileDetails />
              </div>
            </div>
          </div>
          <ProfileSidebar />
        </div>
      </div>
    </ProfileProvider>
  );
}
