"use client";

import {
  ProfileImage,
  ProfileHeader,
  ProfileStats,
  ProfileUserInfo,
  ProfileInterests,
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
        <div className="w-full flex gap-x-8">
          <div className="w-9/12 space-y-8">
            <div className="flex w-full gap-x-6">
              <div className="flex items-center">
                <ProfileImage src="/profile.jpeg" alt="Photo de profil" />
              </div>
              <div className="flex flex-col w-full space-y-6">
                <ProfileHeader />
                <ProfileStats
                  followers={profile?.followers}
                  following={profile?.following}
                />
                <div className="space-y-2">
                  <ProfileUserInfo />
                  <ProfileInterests />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-x-2">
              <div className="space-y-4 p-4 border border-border-light gap-2 rounded-xl">
                <h2 className="text-lg font-medium">Infos</h2>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est
                  qui blanditiis velit temporibus inventore? Enim maxime dolorem
                  optio aut esse ab vel architecto. Exercitationem, fugit.
                  Illum, quis sint. Hic, aspernatur. Lorem ipsum dolor, sit amet
                  consectetur adipisicing elit. Est qui blanditiis velit
                  temporibus inventore? Enim maxime dolorem optio aut esse ab
                  vel architecto. Exercitationem, fugit. Illum, quis sint. Hic,
                  aspernatur.
                </p>
              </div>
            </div>
          </div>
          <ProfileSidebar />
        </div>
      </div>
    </ProfileProvider>
  );
}
