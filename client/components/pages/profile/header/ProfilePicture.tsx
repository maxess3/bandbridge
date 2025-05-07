"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
  const defaultImage = "/profile_large.jpeg";

  const imageURL = src
    ? `${process.env.NEXT_PUBLIC_R2_URL}/${src}`
    : defaultImage;

  const IMG_PROFILE = (
    <Image
      width={300}
      height={300}
      src={imageURL}
      alt={alt}
      className="object-cover h-full rounded-full shadow-xl"
    />
  );

  return (
    <div className="w-52 h-52 flex rounded-full">
      {isOwner && session?.user?.username ? (
        <Link
          onClick={saveLastFocusedElement}
          href={`/${session?.user.username}/edit/profile/picture`}
          className="rounded-full relative overflow-hidden group hover:opacity-90"
        >
          {IMG_PROFILE}
        </Link>
      ) : (
        IMG_PROFILE
      )}
    </div>
  );
};
