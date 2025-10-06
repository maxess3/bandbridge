import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { RiSoundcloudFill } from "react-icons/ri";
import { SocialLinkItem } from "./SocialLinkItem";
import { useSocialLinks } from "../hooks/useSocialLinks";

const SOCIAL_PLATFORMS = [
  {
    value: "youtube",
    label: "YouTube",
    icon: AiOutlineYoutube,
    placeholder: "https://www.youtube.com/@username",
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    placeholder: "https://www.instagram.com/username",
  },
  {
    value: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    placeholder: "https://www.tiktok.com/@username",
  },
  {
    value: "twitter",
    label: "Twitter",
    icon: FaXTwitter,
    placeholder: "https://x.com/username",
  },
  {
    value: "soundcloud",
    label: "SoundCloud",
    icon: RiSoundcloudFill,
    placeholder: "https://soundcloud.com/username",
  },
];

export const SocialLinksSection = () => {
  const {
    socialLinks,
    activeSocialLinks,
    handleSocialButtonClick,
    updateSocialLink,
    handleSocialLinkBlur,
    getSocialLinkError,
    setInputRef,
    setButtonRef,
    setCloseButtonRef,
  } = useSocialLinks();

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-xl">Liens sociaux</h4>

      {/* Boutons des réseaux sociaux */}
      <div className="space-y-1">
        <div className="flex flex-wrap gap-3">
          {SOCIAL_PLATFORMS.map((platform) => {
            const IconComponent = platform.icon;
            const isActive = activeSocialLinks.has(platform.value);
            const hasError = getSocialLinkError(platform.value);

            return (
              <Tooltip key={platform.value} delayDuration={500}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleSocialButtonClick(platform.value)}
                    variant="outline"
                    size="sm"
                    className={`flex items-center gap-2 rounded-full w-12 h-12 ${
                      isActive ? "border-foreground" : ""
                    } ${hasError ? "border-red-500" : ""}`}
                    type="button"
                    aria-label={`${
                      isActive ? "Supprimer" : "Ajouter"
                    } le lien ${platform.label}`}
                    aria-pressed={isActive}
                    ref={(el) => setButtonRef(platform.value, el)}
                  >
                    <IconComponent className="!size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isActive
                      ? `Supprimer le lien ${platform.label}`
                      : `Ajouter le lien ${platform.label}`}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Inputs des liens sociaux actifs */}
      <div className="space-y-4">
        {Array.from(activeSocialLinks).map((platformValue) => {
          const platform = SOCIAL_PLATFORMS.find(
            (p) => p.value === platformValue
          );
          const link = socialLinks.find((l) => l.platform === platformValue);
          const linkError = getSocialLinkError(platformValue);

          if (!platform || !link) return null;

          return (
            <SocialLinkItem
              key={platformValue}
              platform={platform}
              link={link}
              onUpdate={updateSocialLink}
              onRemove={handleSocialButtonClick}
              error={linkError}
              onBlur={handleSocialLinkBlur}
              inputRef={setInputRef}
              closeButtonRef={setCloseButtonRef}
            />
          );
        })}
      </div>
    </div>
  );
};
