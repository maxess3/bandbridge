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
import { Badge } from "@/components/ui/badge";

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
        <div className="w-full flex gap-x-6">
          <div className="w-9/12 space-y-4">
            <div className="flex w-full gap-x-4">
              <div className="flex items-center">
                <ProfileImage src="/profile.jpeg" alt="Photo de profil" />
              </div>
              <div className="flex flex-col w-full justify-between">
                <ProfileHeader />
                <div className="flex gap-x-2">
                  <div className="flex flex-col border border-secondary p-4 rounded-xl">
                    <span className="font-bold">Musicien</span>
                    <span className="text-sm">Guitariste, Pianiste</span>
                  </div>
                  <div className="flex flex-col border border-secondary p-4 rounded-xl">
                    <span className="font-bold">Recherche</span>
                    <span className="text-sm">
                      Groupe (Guitariste, Pianiste)
                    </span>
                  </div>
                  {/* <div className="flex flex-col border border-secondary p-4 rounded-xl">
                    <span className="font-bold">Disponibilités</span>
                    <span className="text-sm">3J / semaine</span>
                  </div>
                  <div className="flex flex-col border border-secondary p-4 rounded-xl">
                    <span className="font-bold">Localisation</span>
                    <span className="text-sm">Toulouse</span>
                  </div> */}
                </div>
                {/* <ProfileInfo /> */}
                {/* <ProfileDetails /> */}
                <div className="flex justify-between border-t border-secondary">
                  <div className="flex gap-x-6 opacity-90 ">
                    <div className="mt-1.5">
                      <span className="font-black">2000</span> Followers
                    </div>
                    <div className="mt-1.5">
                      <span className="font-black">0</span> Suivi(e)s
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-x-2">
              <div className="space-y-4 p-4 border border-secondary rounded-lg gap-2">
                <h2 className="text-xl font-semibold">Infos</h2>
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
