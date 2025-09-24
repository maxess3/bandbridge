"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DefaultProfilePicture } from "../avatar/DefaultProfilePicture";
import { getProfileImageUrl } from "@/utils";
import { ProfileListItem } from "@/types/Profile";

interface ProfileCardProps {
  profile: ProfileListItem;
  variant?: "follower" | "following" | "default";
}

export const ProfileCard = ({
  profile,
  variant = "default",
}: ProfileCardProps) => {
  const { pseudonyme, profilePictureKey, user, _count } = profile;
  const { username } = user;
  const imageURL = getProfileImageUrl(profilePictureKey || "", "medium");

  return (
    <Link
      href={`/${username}`}
      className="block group"
      aria-label={`Voir le profil de ${pseudonyme}`}
    >
      <div className="p-4 rounded-lg border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={imageURL || undefined}
              alt={`Photo de profil de ${pseudonyme}`}
            />
            <AvatarFallback>
              <DefaultProfilePicture />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold truncate">{pseudonyme}</h3>
              {variant === "follower" && (
                <Badge variant="secondary" className="text-xs">
                  Follower
                </Badge>
              )}
              {variant === "following" && (
                <Badge variant="outline" className="text-xs">
                  Following
                </Badge>
              )}
            </div>
            {/* Afficher le nombre d'abonnés */}
            <div className="text-sm text-muted-foreground">
              {_count.followers} followers
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
