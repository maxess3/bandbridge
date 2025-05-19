"use client";

import { useSession } from "next-auth/react";
import { UploadProfilePictureModal } from "@/components/modal/UploadProfilePictureModal";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCamera } from "react-icons/fa";
import { DefaultProfilePicture } from "@/components/features/profile/svg/DefaultProfilePicture";

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
      {isOwner && session?.user?.username && (
        <div className="flex items-center justify-center absolute bottom-0 left-0 w-full h-1/3 bg-black/50 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <FaCamera size={22} className="text-white/80" />
        </div>
      )}
      <Avatar className="w-44 h-44">
        <AvatarImage src={imageURL} alt={alt} />
        <AvatarFallback className="bg-secondary pointer-events-none">
          <DefaultProfilePicture className="mr-4 mt-24 text-background w-[220px] h-[220px]" />
        </AvatarFallback>
      </Avatar>
    </div>
  );

  return (
    <div className="relative">
      <div className="w-44 h-44 flex rounded-full relative">
        {isOwner && session?.user?.username ? (
          <button onClick={() => setIsModalOpen(true)}>{IMG_PROFILE}</button>
        ) : (
          IMG_PROFILE
        )}
      </div>
      {isModalOpen && (
        <UploadProfilePictureModal
          onClose={() => setIsModalOpen(false)}
          open={isModalOpen}
        />
      )}
    </div>
  );
};
