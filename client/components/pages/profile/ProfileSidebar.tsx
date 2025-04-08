import Link from "next/link";
import Image from "next/image";
import ProfileSmall from "@/public/profile_small.png";
import { Avatar } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileSocialLink } from "@/components/pages/profile/ProfileSocialLink";
import { IoAdd } from "react-icons/io5";
import { useProfileContext } from "@/context/ProfileContext";
import { FaUser } from "react-icons/fa";

type SocialPlatform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "twitter"
  | "soundcloud";
type SocialLinks = Partial<Record<SocialPlatform, string>>;

interface SocialLinksProps {
  socialLinks: SocialLinks;
  username: string;
  isPublic: boolean;
}

interface ListItem {
  name: string;
  tag: string;
  subtitle: string;
}

const ListItemWithAvatar = ({
  name,
  tag,
  subtitle,
}: {
  name: string;
  tag: string;
  subtitle: string;
}) => (
  <li className="flex items-center space-x-2 border-b pb-3 last:border-b-0 border-border-extralight last:pb-0">
    <Avatar className="w-11 h-11">
      <div className="relative w-full h-full">
        <Image
          src={ProfileSmall}
          alt={name}
          fill
          className="rounded-full object-cover"
          sizes="44px"
          priority
        />
      </div>
    </Avatar>
    <div className="flex flex-col">
      <span className="font-semibold text-base">
        {name}
        <Badge variant="outline" className="ml-1">
          {tag}
        </Badge>
      </span>
      <span>{subtitle}</span>
    </div>
  </li>
);

const ListSection = ({
  title,
  items,
  buttonText,
}: {
  title: string;
  items: ListItem[];
  buttonText: string;
}) => (
  <div className="border border-border-light rounded-xl">
    <div className="p-4 space-y-3">
      <span className="font-bold text-sm uppercase">{title}</span>
      <ul className="space-y-3 text-sm">
        {items.map((item: ListItem, index: number) => (
          <ListItemWithAvatar key={index} {...item} />
        ))}
      </ul>
    </div>
    <div className="flex items-center justify-center w-full border-t border-border-light">
      <Button
        variant="ghost"
        className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
      >
        {buttonText}
      </Button>
    </div>
  </div>
);

const SocialLinks = ({ socialLinks, username, isPublic }: SocialLinksProps) => {
  const platforms: SocialPlatform[] = [
    "youtube",
    "instagram",
    "tiktok",
    "twitter",
    "soundcloud",
  ];

  return (
    <div className="space-y-3 p-4 border border-border-light rounded-xl">
      <span className="uppercase text-sm font-bold">Liens</span>
      <div className="space-y-2">
        <ul className="text-sm flex items-center flex-wrap gap-2">
          {platforms.map(
            (platform) =>
              socialLinks?.[platform] && (
                <ProfileSocialLink
                  key={platform}
                  platform={platform}
                  url={socialLinks[platform]}
                />
              )
          )}
        </ul>
        {!isPublic && (
          <Link
            href={`/${username}/edit/profile/social`}
            className={
              buttonVariants({ variant: "secondary", size: "xs" }) +
              " !rounded-full"
            }
          >
            <IoAdd style={{ height: 18, width: 18 }} />
            Ajouter un lien
          </Link>
        )}
      </div>
    </div>
  );
};

export const ProfileSidebar = () => {
  const { isPublic, profile } = useProfileContext();

  const nearbyGroups = [
    { name: "Groupe 1", tag: "Rock", subtitle: "Recherche des musiciens" },
    { name: "Groupe 2", tag: "Rap", subtitle: "Recherche des musiciens" },
    { name: "Groupe 3", tag: "Rap", subtitle: "Recherche des musiciens" },
    { name: "Groupe 4", tag: "Rap", subtitle: "Recherche des musiciens" },
  ];

  const nearbyMusicians = [
    { name: "Musicien 1", tag: "Guitare", subtitle: "Recherche un groupe" },
    { name: "Musicien 2", tag: "Chant", subtitle: "Recherche un groupe" },
    { name: "Musicien 3", tag: "Chant", subtitle: "Recherche un groupe" },
    { name: "Musicien 4", tag: "Chant", subtitle: "Recherche un groupe" },
  ];

  return (
    <div className="xl:w-3/12 rounded-xl">
      <div className="space-y-2">
        {(isPublic ? Object.keys(profile?.socialLinks).length > 0 : true) && (
          <SocialLinks
            socialLinks={profile?.socialLinks}
            username={profile?.username}
            isPublic={isPublic}
          />
        )}
        {profile?.lastFollowers.length > 0 ? (
          <div className="space-y-4 border border-border-light rounded-xl">
            <div className="">
              <span className="uppercase text-sm font-bold p-4 inline-flex w-full">
                {profile?.followers} Followers
              </span>
              <div className="w-full">
                {/* {profile?.lastFollowers?.map((follower) => (
                    <li key={follower.username} className="py-2 cursor-pointer">
                      <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-x-2">
                          <Avatar>
                            <div className="w-12 h-12 rounded-full relative group">
                              <Link href={`/${follower.username}`}>
                                <Image
                                  src={ProfileSmall}
                                  alt="Follower"
                                  className="rounded-full border-2 border-background"
                                  fill
                                  sizes="48px"
                                  priority
                                />
                              </Link>
                              <div className="absolute space-y-6 p-4 shadow-xl flex flex-col items-center top-16 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-border-light bg-popover before:content-[''] before:absolute before:-top-2.5 before:left-1/2 before:-translate-x-1/2 before:w-5 before:h-5 before:bg-popover before:border-t before:border-l before:border-border-light before:rotate-45">
                                <div className="h-32 w-32 rounded-full relative bg-[red]"></div>
                                <div className="flex flex-col items-center gap-y-2">
                                  <span className="text-lg font-semibold font-satoshi">
                                    {follower.firstName}
                                  </span>
                                  <span className="text-sm flex items-center gap-x-1 opacity-80 font-semibold">
                                    <FaUser />
                                    {follower.followersCount}
                                  </span>
                                  <span className="text-sm flex items-center gap-1 opacity-80 font-semibold">
                                    {follower.city}
                                  </span>
                                </div>
                                <div>
                                  <Button variant="primary" size="md">
                                    Suivre
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Avatar>
                          <div>
                            <span className="text-lg font-extrabold font-satoshi hover:underline">
                              {follower.firstName}
                            </span>
                            <span className="text-sm flex items-center gap-x-1 opacity-80 font-semibold">
                              @{follower.username}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Button
                            variant="primary"
                            size="md"
                            className="text-sm"
                          >
                            Suivre
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))*/}
                <ul className="flex items-center w-full px-4">
                  {profile?.lastFollowers?.map((follower) => (
                    <li key={follower.username} className="-mr-2">
                      <Avatar>
                        <div className="w-12 h-12 rounded-full relative group">
                          <Link href={`/${follower.username}`}>
                            <Image
                              src={ProfileSmall}
                              alt="Follower"
                              className="rounded-full border-2 border-background"
                              fill
                              sizes="48px"
                              priority
                            />
                          </Link>
                          <div className="hidden group-hover:flex absolute space-y-6 p-4 shadow-xl flex-col items-center top-16 left-1/2 -translate-x-1/2 z-50 rounded-lg border border-border-light bg-popover before:content-[''] before:absolute before:-top-2.5 before:left-1/2 before:-translate-x-1/2 before:w-5 before:h-5 before:bg-popover before:border-t before:border-l before:border-border-light before:rotate-45">
                            <div className="h-32 w-32 rounded-full relative bg-[red]"></div>
                            <div className="flex flex-col items-center gap-y-2">
                              <span className="text-lg font-semibold font-satoshi">
                                {follower.firstName}
                              </span>
                              <span className="text-sm flex items-center gap-x-1 opacity-80 font-semibold">
                                <FaUser />
                                {follower.followersCount}
                              </span>
                              <span className="text-sm flex items-center gap-1 opacity-80 font-semibold">
                                {follower.city}
                              </span>
                            </div>
                            <div>
                              <Button variant="primary" size="md">
                                Suivre
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Avatar>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center w-full border-t border-border-light">
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

        <ListSection
          title="Groupes à proximité"
          items={nearbyGroups}
          buttonText="Tout afficher"
        />
        <ListSection
          title="Musiciens à proximité"
          items={nearbyMusicians}
          buttonText="Tout afficher"
        />
      </div>
    </div>
  );
};
