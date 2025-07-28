"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ProfileSmall from "@/public/profile_small.png";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Profile } from "@/types/Profile";
import { ProfileMusicianInfos } from "@/components/features/profile/aside/ProfileMusicianInfos";

export const ProfileAside = ({
  profile,
  isOwner,
}: {
  profile: Profile;
  isOwner: boolean;
}) => {
  const { data: session } = useSession();

  return (
    <aside className="rounded-xl lg:w-[350px] md:w-[300px] w-full">
      <div className="md:space-y-3 space-y-2">
        <ProfileMusicianInfos profile={profile} isOwner={isOwner} />
        {profile?.lastFollowers.length && !isOwner ? (
          <div className="space-y-4 border rounded-xl bg-[#111111]">
            <div>
              <span className="uppercase text-sm font-bold p-4 inline-flex w-full">
                {profile?.followers} Abonnés
              </span>
              <div className="w-full">
                <ul className="flex items-center w-full px-4">
                  {profile?.lastFollowers?.map((follower) => (
                    <li key={follower.username} className="-mr-2">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Link href={`/${follower.username}`}>
                            <Image
                              src={ProfileSmall}
                              alt="Follower"
                              className="rounded-full border-2 border-background"
                              sizes="48px"
                              priority
                            />
                          </Link>
                        </HoverCardTrigger>
                        <HoverCardContent className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="h-16 w-16 rounded-full relative bg-secondary">
                              <Link href={`/${follower.username}`}>
                                <Image
                                  src={ProfileSmall}
                                  alt="Follower"
                                  fill
                                  className="rounded-full"
                                />
                              </Link>
                            </div>
                            {follower?.username !== session?.user?.username &&
                              session?.user && (
                                <div>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="text-base"
                                  >
                                    Suivre
                                  </Button>
                                </div>
                              )}
                          </div>
                          <div>
                            <span className="text-lg font-semibold">
                              <Link
                                href={`/${follower.username}`}
                                className="hover:underline"
                              >
                                {follower.firstName}
                              </Link>
                            </span>
                            <span className="text-sm flex items-center gap-x-1 opacity-80 font-semibold">
                              @{follower.username}
                            </span>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center w-full border-t">
              <Button
                variant="ghost"
                className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
              >
                Tout afficher
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </aside>
  );
};
