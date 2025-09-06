"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { EditProfilePictureModal } from "@/components/features/profile/modals/EditProfilePictureModal";
import { useFocusManager } from "@/contexts/FocusManagerContext";
import { getProfileImageUrl } from "@/utils/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DefaultProfilePicture } from "@/components/features/profile/avatar/DefaultProfilePicture";

export const ProfilePicture = ({
  isOwner,
  src,
  alt,
}: {
  isOwner: boolean;
  src: string;
  alt: string;
}) => {
  const { captureFocus } = useFocusManager();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageURL = getProfileImageUrl(src, "medium");

  const handleImageClick = () => {
    captureFocus();
    setIsModalOpen(true);
  };

  const IMG_PROFILE = (
    <Avatar className="rounded-full w-64 h-64 border-2">
      <AvatarImage
        src={imageURL ? imageURL : undefined}
        alt={alt}
        className="rounded-full border"
      />
      <AvatarFallback className="bg-secondary">
        <DefaultProfilePicture className="mr-4 mt-24 text-background w-64 h-64" />
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className="flex">
      {isOwner && session?.user?.username ? (
        <button
          onClick={handleImageClick}
          aria-label="Modifier la photo de profil"
        >
          {IMG_PROFILE}
        </button>
      ) : (
        IMG_PROFILE
      )}
      {isModalOpen && (
        <EditProfilePictureModal
          onClose={() => setIsModalOpen(false)}
          open={isModalOpen}
        />
      )}
    </div>
  );
};
