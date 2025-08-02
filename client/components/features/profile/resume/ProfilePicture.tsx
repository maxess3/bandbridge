"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DefaultProfilePicture } from "@/components/features/profile/icons/DefaultProfilePicture";
import { EditProfilePictureModal } from "@/components/features/profile/modals/EditProfilePictureModal";
import { useFocusManager } from "@/contexts/FocusManagerContext";

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

  const imageURL = process.env.NEXT_PUBLIC_R2_URL + "/" + src;

  const handleImageClick = () => {
    captureFocus();
    setIsModalOpen(true);
  };

  const IMG_PROFILE = (
    <div className="relative group overflow-hidden rounded-full">
      <Avatar className="lg:w-40 lg:h-40 w-36 h-36 border-4 border-background">
        <AvatarImage src={imageURL} alt={alt} />
        <AvatarFallback className="bg-secondary pointer-events-none">
          <DefaultProfilePicture className="mr-4 mt-24 text-background w-[220px] h-[220px]" />
        </AvatarFallback>
      </Avatar>
    </div>
  );

  return (
    <div className="absolute -bottom-12 left-6 z-[5]">
      <div className="lg:w-40 lg:h-40 w-36 h-36 flex rounded-full relative bg-background">
        {isOwner && session?.user?.username ? (
          <button
            onClick={handleImageClick}
            className="rounded-full"
            aria-label="Modifier la photo de profil"
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
