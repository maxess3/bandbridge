"use client";

import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DefaultProfilePicture } from "@/components/features/profile/svg/DefaultProfilePicture";

export const ProfilePictureForm = () => {
  const { data: profile } = useProfile();

  const imageURL =
    process.env.NEXT_PUBLIC_R2_URL + "/" + profile?.profilePictureKey;

  return (
    <div className="space-y-6 min-h-46 py-2">
      <div className="flex flex-col items-center">
        <div className="w-60 h-60 flex rounded-full relative">
          <Avatar className="w-60 h-60">
            <AvatarImage src={imageURL} alt="Photo de profil" />
            <AvatarFallback className="bg-secondary">
              <DefaultProfilePicture className="mr-4 mt-24 text-background w-[285px] h-[285px]" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
