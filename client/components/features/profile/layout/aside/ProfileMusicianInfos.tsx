import Link from "next/link";
import { EditSectionButton } from "@/components/features/profile/buttons/EditSectionButton";
import { formatDateToMonthYear } from "@/utils";
import { Profile } from "@/types/Profile";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { RiSoundcloudFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CollapsibleText } from "@/components/shared/buttons/CollapsibleText";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SOCIAL_PLATFORMS = [
  {
    key: "youtube",
    label: "YouTube",
    icon: AiOutlineYoutube,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
  },
  {
    key: "twitter",
    label: "Twitter",
    icon: FaXTwitter,
  },
  {
    key: "soundcloud",
    label: "SoundCloud",
    icon: RiSoundcloudFill,
  },
];

export const ProfileMusicianInfos = ({
  profile,
  isOwner,
}: {
  profile: Profile;
  isOwner: boolean;
}) => {
  // Filtrer les liens sociaux qui ont une URL
  const activeSocialLinks = SOCIAL_PLATFORMS.filter(
    (platform) =>
      profile?.socialLinks?.[platform.key as keyof typeof profile.socialLinks]
  );

  const description = profile?.description || "";

  return (
    <div className="flex flex-col rounded-xl border relative p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Infos</h2>
        <EditSectionButton
          isOwner={isOwner}
          url={`/${profile?.username}/edit/profile/info`}
        />
      </div>
      <CollapsibleText text={description} maxLines={4} alignButton="right" />
      <div className="flex justify-center flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Membre depuis : </span>
          <span className="uppercase">
            {profile?.createdAt
              ? formatDateToMonthYear(profile.createdAt)
              : "Non disponible"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Concerts joués : </span>
          <span className="uppercase">
            {profile?.concertsPlayed === "NOT_SPECIFIED" && "-"}
            {profile?.concertsPlayed === "LESS_THAN_10" && "Moins de 10"}
            {profile?.concertsPlayed === "TEN_TO_FIFTY" && "10 à 50"}
            {profile?.concertsPlayed === "FIFTY_TO_HUNDRED" && "50 à 100"}
            {profile?.concertsPlayed === "MORE_THAN_HUNDRED" && "100+"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Répète souvent : </span>
          <span className="uppercase">
            {profile?.rehearsalsPerWeek === "NOT_SPECIFIED" && "-"}
            {profile?.rehearsalsPerWeek === "ONCE_PER_WEEK" &&
              "1 fois / semaine"}
            {profile?.rehearsalsPerWeek === "TWO_TO_THREE_PER_WEEK" &&
              "2-3 fois / semaine"}
            {profile?.rehearsalsPerWeek === "MORE_THAN_THREE_PER_WEEK" &&
              "Plus de 3 fois / semaine"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Type de pratique : </span>
          <span className="uppercase">
            {profile?.practiceType === "NOT_SPECIFIED" && "-"}
            {profile?.practiceType === "HOBBY" && "Loisir"}
            {profile?.practiceType === "ACTIVE" && "En activité"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Recherche un groupe : </span>
          <span className="uppercase">
            {profile?.isLookingForBand ? "Oui" : "Non"}
          </span>
        </div>
      </div>
      {activeSocialLinks.length > 0 && (
        <div className="flex flex-col">
          <div className="flex gap-3 flex-wrap">
            {activeSocialLinks.map((platform) => {
              const PlatformIcon = platform.icon;
              const url =
                profile.socialLinks[
                  platform.key as keyof typeof profile.socialLinks
                ];

              return (
                <Tooltip delayDuration={500} key={platform.key}>
                  <TooltipTrigger asChild>
                    <Link
                      href={url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "flex items-center gap-2 rounded-full text-sm h-12 w-12"
                      )}
                    >
                      <PlatformIcon className="!size-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{platform.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
