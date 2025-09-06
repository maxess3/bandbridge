"use client";

import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DefaultProfilePicture } from "@/components/features/profile/avatar/DefaultProfilePicture";
import { getProfileImageUrl } from "@/utils/utils";

export const ProfilePictureMain = () => {
  const { data: profile } = useProfile();

  const imageURL = getProfileImageUrl(
    profile?.profilePictureKey || "",
    "medium"
  );

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col items-center">
        <div className="md:w-56 md:h-56 w-48 h-48 flex rounded-full relative">
          <Avatar className="md:w-56 md:h-56 w-48 h-48">
            <AvatarImage src={imageURL || undefined} alt="Photo de profil" />
            <AvatarFallback className="bg-secondary">
              <DefaultProfilePicture className="mr-4 mt-24 text-background w-[285px] h-[285px]" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
