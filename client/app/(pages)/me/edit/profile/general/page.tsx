"use client";

import {
  ProfileImage,
  ProfileHeader,
  ProfileInfo,
  ProfileDetails,
  ProfileSidebar,
} from "@/components/pages/profile/index";
import { useProfile } from "@/hooks/useProfile";

export default function RootPage() {
  const { data: profile } = useProfile();

  return (
    <div className="py-8 flex flex-col w-full">
      <div className="w-full flex gap-x-4">
        <div className="w-9/12">
          <div className="flex gap-x-8 w-full">
            <div className="flex items-center">
              <ProfileImage src="/profile.jpeg" alt="Photo de profil" />
            </div>
            <div className="flex flex-col w-full">
              <ProfileHeader
                firstname={profile?.firstName}
                username={`@${profile?.username}`}
              />
              <ProfileInfo />
              <ProfileDetails profile={profile} />
            </div>
          </div>
        </div>
        <ProfileSidebar socialLinks={profile?.socialLinks} />
      </div>
    </div>
  );
}
