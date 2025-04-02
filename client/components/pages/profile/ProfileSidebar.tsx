import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileSocialLink } from "@/components/pages/profile/ProfileSocialLink";
import { IoAdd } from "react-icons/io5";
import { useProfileContext } from "@/context/ProfileContext";

type SocialPlatform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "twitter"
  | "soundcloud";
type SocialLinks = Partial<Record<SocialPlatform, string>>;

interface SocialLinksProps {
  socialLinks: SocialLinks;
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
      <AvatarImage
        className="rounded-full"
        src="https://github.com/shadcn.png"
        alt={name}
      />
      <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
      <span className="font-semibold">{title}</span>
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

const SocialLinks = ({ socialLinks, isPublic }: SocialLinksProps) => {
  const platforms: SocialPlatform[] = [
    "youtube",
    "instagram",
    "tiktok",
    "twitter",
    "soundcloud",
  ];

  return (
    <div className="space-y-3 p-4 border border-border-light rounded-xl">
      <span className="font-semibold">Liens</span>
      <div className="space-y-2">
        <ul className="text-sm flex items-center flex-wrap gap-2">
          {platforms.map(
            (platform) =>
              socialLinks[platform] && (
                <ProfileSocialLink
                  key={platform}
                  platform={platform}
                  url={socialLinks[platform]}
                />
              )
          )}
        </ul>
        {!isPublic && (
          <Link href="/me/edit/profile/social" className="flex">
            <Button variant="secondary" size="xs">
              <IoAdd style={{ height: 18, width: 18 }} />
              Ajouter un lien
            </Button>
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
    <div className="w-3/12 rounded-xl">
      <div className="space-y-2">
        {isPublic ? (
          ""
        ) : (
          <div className="space-y-3 p-4 border border-border-light rounded-xl">
            <span className="font-semibold">Profil public</span>
            <div className="text-sm">{`https://www.bandbridge/${profile?.username}`}</div>
          </div>
        )}

        {(isPublic ? Object.keys(profile?.socialLinks).length > 0 : true) && (
          <SocialLinks socialLinks={profile?.socialLinks} isPublic={isPublic} />
        )}

        <ListSection
          title="Groupes à proximité"
          items={nearbyGroups}
          buttonText="Voir les groupes"
        />

        <ListSection
          title="Musiciens à proximité"
          items={nearbyMusicians}
          buttonText="Voir les musiciens"
        />
      </div>
    </div>
  );
};
