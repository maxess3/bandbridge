"use client";

import { useSession } from "next-auth/react";
import { EditProfilePictureModal } from "@/components/modal/EditProfilePictureModal";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PiUser } from "react-icons/pi";

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
  const defaultImage = "/profile_large.jpeg";

  const imageURL = process.env.NEXT_PUBLIC_R2_URL + "/" + src;

  const IMG_PROFILE = (
    <Avatar className="w-48 h-48">
      <AvatarImage src={imageURL} alt={alt} />
      <AvatarFallback>
        <PiUser size={58} />
      </AvatarFallback>
    </Avatar>
  );

  return (
    <>
      <div className="w-52 h-52 flex rounded-full">
        {isOwner && session?.user?.username ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full relative overflow-hidden group hover:opacity-90"
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
    </>
  );
};
