"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DefaultProfilePicture } from "@/components/features/profile/components/icons/DefaultProfilePicture";
import { EditProfilePictureModal } from "@/components/features/profile/modals/EditProfilePictureModal";
import { saveLastFocusedElement } from "@/utils/utils";

export const ProfilePicture = ({
  isOwner,
  src,
  alt,
}: {
  isOwner: boolean;
  src: string;
  alt: string;
}) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageURL = process.env.NEXT_PUBLIC_R2_URL + "/" + src;

  const IMG_PROFILE = (
    <div className="relative group overflow-hidden rounded-full">
      <Avatar className="w-40 h-40 border-8 border-opacity-5 border-white">
        <AvatarImage src={imageURL} alt={alt} />
        <AvatarFallback className="bg-secondary pointer-events-none">
          <DefaultProfilePicture className="mr-4 mt-24 text-background w-[220px] h-[220px]" />
        </AvatarFallback>
      </Avatar>
    </div>
  );

  return (
    <div className="absolute -bottom-12 left-6">
      <div className="w-40 h-40 flex rounded-full relative">
        {isOwner && session?.user?.username ? (
          <button
            onClick={() => {
              setIsModalOpen(true);
              saveLastFocusedElement();
            }}
          >
            {IMG_PROFILE}
          </button>
        ) : (
          IMG_PROFILE
        )}
      </div>
      {isModalOpen && (
        <EditProfilePictureModal
          onClose={() => setIsModalOpen(false)}
          open={isModalOpen}
        />
      )}
    </div>
  );
};
