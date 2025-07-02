"use client";

import { useFormContext } from "react-hook-form";
import { formInfoProfile } from "@/lib/schema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { RiSoundcloudFill } from "react-icons/ri";
import { useState, useCallback } from "react";
import { Plus, X } from "lucide-react";

type FormValues = z.infer<typeof formInfoProfile>;

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

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

export const UpdateProfileInfoForm = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<FormValues>();

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const addSocialLink = useCallback(() => {
    const newLink: SocialLink = {
      id: `social-${Date.now()}`,
      platform: "",
      url: "",
    };
    setSocialLinks((prev) => [...prev, newLink]);
  }, []);

  const removeSocialLink = useCallback((id: string) => {
    setSocialLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  const updateSocialLink = useCallback(
    (id: string, field: "platform" | "url", value: string) => {
      setSocialLinks((prev) =>
        prev.map((link) =>
          link.id === id ? { ...link, [field]: value } : link
        )
      );
    },
    []
  );

  const getPlatformIcon = (platformValue: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.value === platformValue);
    return platform?.icon;
  };

  const getPlatformPlaceholder = (platformValue: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.value === platformValue);
    return platform?.placeholder || "";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="opacity-80 flex items-center text-sm"
        >
          Vous pouvez évoquer votre expérience, votre domaine d'activité ou vos
          compétences.
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          className={`bg-transparent text-base md:text-base min-h-[220px] ${
            errors.description && "border-red-500"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-2xl">Liens sociaux</h4>
          <Button
            type="button"
            onClick={addSocialLink}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un lien social
          </Button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((link) => {
            const IconComponent = getPlatformIcon(link.platform);

            return (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-[140px]">
                  {IconComponent && <IconComponent className="text-lg" />}
                  <Select
                    value={link.platform}
                    onValueChange={(value) =>
                      updateSocialLink(link.id, "platform", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_PLATFORMS.map((platform) => {
                        const PlatformIcon = platform.icon;
                        return (
                          <SelectItem
                            key={platform.value}
                            value={platform.value}
                          >
                            <div className="flex items-center gap-2">
                              <PlatformIcon className="text-lg" />
                              {platform.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Input
                    placeholder={getPlatformPlaceholder(link.platform)}
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(link.id, "url", e.target.value)
                    }
                    className="bg-transparent"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => removeSocialLink(link.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          {socialLinks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Aucun lien social ajouté</p>
              <p className="text-sm">
                Cliquez sur "Ajouter un lien social" pour commencer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
