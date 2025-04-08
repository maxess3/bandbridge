"use client";
import { useState } from "react";
import {
  ProfileImage,
  ProfileHeader,
  ProfileStats,
  ProfileUserInfo,
  ProfileInterests,
  ProfileSidebar,
} from "@/components/pages/profile/index";
import { Button } from "@/components/ui/button";
import { ProfileProvider } from "@/providers/ProfileProvider";
import { Profile } from "@/types/Profile";
import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
interface ProfileLayoutProps {
  isPublic?: boolean;
  profile: Profile;
}

function AudioCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div
        className="relative flex items-center justify-center aspect-square bg-secondary rounded-lg group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlay}
      >
        <div
          className={`
        absolute inset-0 flex items-center justify-center
        transition-opacity duration-200
        ${
          isHovered || isPlaying
            ? "opacity-100 bg-primary rounded-lg"
            : "opacity-0"
        }
      `}
        >
          {isPlaying ? (
            <IoPauseOutline className="w-12 h-12 text-white" />
          ) : (
            <IoPlayOutline className="w-12 h-12 text-white" />
          )}
        </div>
      </div>
      <div className="font-semibold">Nom de la musique</div>
    </div>
  );
}

export function ProfileLayout({
  isPublic = false,
  profile,
}: ProfileLayoutProps) {
  return (
    <ProfileProvider isPublic={isPublic} profile={profile}>
      <div className="py-8 flex flex-col w-full">
        <div className="w-full flex gap-x-8">
          <div className="xl:w-9/12 space-y-8">
            <div className="flex w-full gap-x-6">
              <div className="flex items-center">
                <ProfileImage src="/profile_large.jpeg" alt="Photo de profil" />
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
              <div className="border border-border-light gap-2 rounded-xl">
                <div className="p-4 space-y-4">
                  <h2 className="text-xl font-semibold">Musique</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <AudioCard key={index} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center w-full border-t border-border-light">
                  <Button
                    variant="ghost"
                    className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
                  >
                    Tout afficher
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <ProfileSidebar />
        </div>
      </div>
    </ProfileProvider>
  );
}
