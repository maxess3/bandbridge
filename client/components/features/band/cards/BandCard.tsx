"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DefaultProfilePicture } from "@/components/features/profile/avatar/DefaultProfilePicture";
import { getImageUrl } from "@/utils";
import { BandListItem } from "@/types/Band";

interface BandCardProps {
  band: BandListItem;
}

export const BandCard = ({ band }: BandCardProps) => {
  const { name, slug, profilePictureKey, _count } = band;
  const imageURL = getImageUrl(profilePictureKey || "", "medium");

  return (
    <Link
      href={`/band/${slug}`}
      className="block group"
      aria-label={`Voir le groupe ${name}`}
    >
      <div className="p-4 rounded-lg border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={imageURL || undefined}
              alt={`Photo du groupe ${name}`}
            />
            <AvatarFallback>
              <DefaultProfilePicture />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold truncate">{name}</h3>
            </div>
            {/* Afficher le nombre de membres */}
            <div className="text-sm text-muted-foreground">
              {_count.members} membre{_count.members > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
