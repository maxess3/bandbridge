import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileSocialLink } from "@/components/pages/profile/ProfileSocialLink";
import { IoAdd } from "react-icons/io5";
import { useProfileContext } from "@/context/ProfileContext";

export const ProfileSidebar = () => {
  const { isPublic, profile } = useProfileContext();

  return (
    <div className="w-3/12 rounded-xl">
      <div className="space-y-2">
        {isPublic ? (
          ""
        ) : (
          <div className="space-y-3 p-4 border border-secondary rounded-xl">
            <span className="font-semibold text-sm uppercase">
              Profil public
            </span>
            <div className="text-sm w-full text-wrap">{`https://www.bandbridge/${profile?.username}`}</div>
          </div>
        )}
        <div className="space-y-3 p-4 border border-secondary rounded-xl">
          <span className="font-semibold text-sm uppercase">Liens</span>
          <div className="space-y-2">
            <ul className="text-sm flex items-center flex-wrap gap-2">
              {profile?.socialLinks.youtube && (
                <ProfileSocialLink
                  platform="youtube"
                  url={profile?.socialLinks.youtube}
                />
              )}
              {profile?.socialLinks.instagram && (
                <ProfileSocialLink
                  platform="instagram"
                  url={profile?.socialLinks.instagram}
                />
              )}
              {profile?.socialLinks.tiktok && (
                <ProfileSocialLink
                  platform="tiktok"
                  url={profile?.socialLinks.tiktok}
                />
              )}
              {profile?.socialLinks.twitter && (
                <ProfileSocialLink
                  platform="twitter"
                  url={profile?.socialLinks.twitter}
                />
              )}
              {profile?.socialLinks.soundcloud && (
                <ProfileSocialLink
                  platform="soundcloud"
                  url={profile?.socialLinks.soundcloud}
                />
              )}
            </ul>
            {isPublic ? (
              ""
            ) : (
              <Link href="/me/edit/profile/social" className="flex">
                <Button variant="linkForm" size="xs">
                  <IoAdd style={{ height: 18, width: 18 }} />
                  Ajouter un lien
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="border border-secondary rounded-xl">
          <div className="p-4 space-y-3">
            <span className="font-semibold text-sm uppercase">
              Groupes à proximité
            </span>
            <div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2 border-b border-secondary pb-3">
                  <Avatar className="w-11 h-11">
                    <AvatarImage
                      className="rounded-full"
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">
                      Les killers
                      <Badge variant="outline" className="ml-1">
                        Rock
                      </Badge>
                    </span>
                    <span>Recherche des musiciens</span>
                  </div>
                </li>
                <li className="flex items-center space-x-2 border-b border-secondary pb-3">
                  <Avatar className="w-11 h-11">
                    <AvatarImage
                      className="rounded-full"
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">
                      Gang Gang
                      <Badge variant="outline" className="ml-1">
                        Rap
                      </Badge>
                    </span>
                    <span>Recherche des musiciens</span>
                  </div>
                </li>
                <li className="flex items-center space-x-2 border-b border-secondary pb-3">
                  <Avatar className="w-11 h-11">
                    <AvatarImage
                      className="rounded-full"
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">
                      Petit bonhomme
                      <Badge variant="outline" className="ml-1">
                        Variété
                      </Badge>
                    </span>
                    <span>Recherche des musiciens</span>
                  </div>
                </li>
                <li className="flex items-center space-x-2">
                  <Avatar className="w-11 h-11">
                    <AvatarImage
                      className="rounded-full"
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">
                      Les raptors
                      <Badge variant="outline" className="ml-1">
                        Funk
                      </Badge>
                    </span>
                    <span>Recherche des musiciens</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center w-full border-t border-secondary">
            <Button
              variant="ghost"
              className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
            >
              Voir les groupes
            </Button>
          </div>
        </div>
        <div className="border border-secondary rounded-xl">
          <div className="p-4 space-y-3">
            <span className="font-semibold text-sm uppercase">
              Musiciens à proximité
            </span>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 border-b border-secondary pb-3">
                <Avatar className="w-11 h-11">
                  <AvatarImage
                    className="rounded-full"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">
                    Maxime
                    <Badge variant="outline" className="ml-1">
                      Guitare
                    </Badge>
                  </span>
                  <span>Rercherche un groupe</span>
                </div>
              </li>
              <li className="flex items-center space-x-2 border-b border-secondary pb-3">
                <Avatar className="w-11 h-11">
                  <AvatarImage
                    className="rounded-full"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">
                    Édouard
                    <Badge variant="outline" className="ml-1">
                      Chant
                    </Badge>
                  </span>
                  <span>Rercherche un groupe</span>
                </div>
              </li>
              <li className="flex items-center space-x-2 border-b border-secondary pb-3">
                <Avatar className="w-11 h-11">
                  <AvatarImage
                    className="rounded-full"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">
                    Marie
                    <Badge variant="outline" className="ml-1">
                      Chant
                    </Badge>
                  </span>
                  <span>Rercherche un groupe</span>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Avatar className="w-11 h-11">
                  <AvatarImage
                    className="rounded-full"
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">
                    Ludivine
                    <Badge variant="outline" className="ml-1">
                      Basse
                    </Badge>
                  </span>
                  <span>Rercherche un groupe</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center w-full border-t border-secondary">
            <Button
              variant="ghost"
              className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
            >
              Voir les musiciens
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
