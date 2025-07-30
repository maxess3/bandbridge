"use client";

import { useFormContext, Controller } from "react-hook-form";
import { formInfoProfile } from "@/lib/schema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Radio } from "@/components/shared/buttons/Radio";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/shared/forms/NativeSelect";
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
import { useState, useCallback, useEffect, useRef } from "react";
import { Trash } from "lucide-react";

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
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<FormValues>();

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [activeSocialLinks, setActiveSocialLinks] = useState<Set<string>>(
    new Set()
  );
  const initialized = useRef(false);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const closeButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {}
  );

  // Obtenir les valeurs actuelles du formulaire
  const formValues = watch();
  const descriptionValue = formValues.description || "";
  const maxChars = 2600;
  const currentChars = descriptionValue.length;

  // Initialiser les liens sociaux depuis les valeurs du formulaire
  useEffect(() => {
    if (initialized.current) return;

    const initialLinks: SocialLink[] = [];
    const initialActiveLinks = new Set<string>();

    SOCIAL_PLATFORMS.forEach((platform) => {
      const url = formValues[platform.value as keyof FormValues] as string;
      if (url) {
        const linkId = `social-${platform.value}-${Date.now()}`;
        initialLinks.push({
          id: linkId,
          platform: platform.value,
          url: url,
        });
        initialActiveLinks.add(platform.value);
      }
    });

    setSocialLinks(initialLinks);
    setActiveSocialLinks(initialActiveLinks);
    initialized.current = true;
  }, [formValues]);

  // Synchroniser les changements d'état avec le formulaire
  useEffect(() => {
    if (!initialized.current) return;

    // Réinitialiser tous les champs sociaux
    SOCIAL_PLATFORMS.forEach((platform) => {
      setValue(platform.value as keyof FormValues, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    });

    // Mettre à jour avec les liens actuels
    socialLinks.forEach((link) => {
      if (link.platform && link.url) {
        setValue(link.platform as keyof FormValues, link.url, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    });
  }, [socialLinks, setValue]);

  // Fonction pour gérer le focus lors de la suppression d'un lien social
  const handleFocusAfterRemoval = useCallback(
    (removedPlatform: string, currentActiveLinks: Set<string>) => {
      // Obtenir l'ordre des plateformes actives dans l'ordre d'ouverture
      const activePlatformsInOrder = socialLinks
        .map((link) => link.platform)
        .filter((platform) => currentActiveLinks.has(platform));

      const removedIndex = activePlatformsInOrder.indexOf(removedPlatform);
      const remainingPlatforms = activePlatformsInOrder.filter(
        (platform) => platform !== removedPlatform
      );

      // Déterminer l'élément à focus
      let elementToFocus: HTMLElement | null = null;

      if (remainingPlatforms.length > 0) {
        // Focus sur le bouton close précédent s'il existe, sinon sur le premier restant
        const targetPlatform =
          removedIndex > 0
            ? activePlatformsInOrder[removedIndex - 1]
            : remainingPlatforms[0];
        elementToFocus = closeButtonRefs.current[targetPlatform];
      } else {
        // Focus sur le bouton du réseau social correspondant
        elementToFocus = buttonRefs.current[removedPlatform];
      }

      // Appliquer le focus directement
      if (elementToFocus) {
        elementToFocus.focus();
      }
    },
    [socialLinks]
  );

  const handleSocialButtonClick = useCallback(
    (platformValue: string) => {
      // Si le lien social est déjà actif, le désactiver
      if (activeSocialLinks.has(platformValue)) {
        // Gérer le focus avant de supprimer
        handleFocusAfterRemoval(platformValue, activeSocialLinks);

        setActiveSocialLinks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(platformValue);
          return newSet;
        });

        // Supprimer le lien social correspondant
        setSocialLinks((prev) => {
          const updatedLinks = prev.filter(
            (link) => link.platform !== platformValue
          );
          return updatedLinks;
        });
      } else {
        // Activer le lien social
        setActiveSocialLinks((prev) => new Set(prev).add(platformValue));

        // Ajouter un nouveau lien social
        const newLink: SocialLink = {
          id: `social-${platformValue}-${Date.now()}`,
          platform: platformValue,
          url: "",
        };
        setSocialLinks((prev) => {
          const updatedLinks = [...prev, newLink];
          return updatedLinks;
        });

        // Focus automatique sur le nouvel input
        requestAnimationFrame(() => {
          const newInput = inputRefs.current[platformValue];
          if (newInput) {
            newInput.focus();
          }
        });
      }
    },
    [activeSocialLinks, handleFocusAfterRemoval]
  );

  const updateSocialLink = useCallback(
    (platform: string, value: string) => {
      setSocialLinks((prev) => {
        const updatedLinks = prev.map((link) =>
          link.platform === platform ? { ...link, url: value } : link
        );
        return updatedLinks;
      });

      // Déclencher la validation immédiatement
      setValue(platform as keyof FormValues, value, {
        shouldValidate: true,
      });
    },
    [setValue]
  );

  // Fonction pour obtenir l'erreur d'un lien social spécifique
  const getSocialLinkError = (platform: string) => {
    return errors[platform as keyof FormValues]?.message as string | undefined;
  };

  // Fonction pour obtenir l'URL actuelle d'une plateforme
  const getCurrentUrl = (platformValue: string) => {
    const link = socialLinks.find((link) => link.platform === platformValue);
    return link?.url || "";
  };

  // Fonction pour assigner une référence à un input
  const setInputRef = useCallback(
    (platform: string, element: HTMLInputElement | null) => {
      inputRefs.current[platform] = element;
    },
    []
  );

  // Fonction pour assigner une référence à un bouton
  const setButtonRef = useCallback(
    (platform: string, element: HTMLButtonElement | null) => {
      buttonRefs.current[platform] = element;
    },
    []
  );

  // Fonction pour assigner une référence à un bouton close
  const setCloseButtonRef = useCallback(
    (platform: string, element: HTMLButtonElement | null) => {
      closeButtonRefs.current[platform] = element;
    },
    []
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-1">
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
        <div className="flex justify-between items-center">
          {errors.description && (
            <p className="text-red-500 text-sm">
              {errors.description?.message?.toString()}
            </p>
          )}
          <p
            className={`text-sm ml-auto ${
              currentChars > maxChars ? "text-red-500" : "text-foreground/80"
            }`}
          >
            {currentChars} / {maxChars}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="font-semibold text-xl">Expérience musicale</h4>
        <div className="space-y-1">
          <Label htmlFor="concertsPlayed" className="opacity-80 text-sm">
            Concerts joués
          </Label>
          <Controller
            name="concertsPlayed"
            control={control}
            render={({ field }) => (
              <NativeSelect
                {...field}
                id="concertsPlayed"
                options={[
                  { value: "NOT_SPECIFIED", label: "Non spécifié" },
                  { value: "LESS_THAN_10", label: "Moins de 10" },
                  { value: "TEN_TO_FIFTY", label: "10 à 50" },
                  { value: "FIFTY_TO_HUNDRED", label: "50 à 100" },
                  { value: "MORE_THAN_HUNDRED", label: "100+" },
                ]}
                placeholder="Sélectionner une option"
                className={`w-full ${
                  errors.concertsPlayed ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.concertsPlayed && (
            <p className="text-red-500 text-sm">
              {errors.concertsPlayed?.message?.toString()}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="rehearsalsPerWeek" className="opacity-80 text-sm">
            Répétitions par semaine
          </Label>
          <Controller
            name="rehearsalsPerWeek"
            control={control}
            render={({ field }) => (
              <NativeSelect
                {...field}
                id="rehearsalsPerWeek"
                options={[
                  { value: "NOT_SPECIFIED", label: "Non spécifié" },
                  { value: "ONCE_PER_WEEK", label: "1 fois par semaine" },
                  {
                    value: "TWO_TO_THREE_PER_WEEK",
                    label: "2-3 fois par semaine",
                  },
                  {
                    value: "MORE_THAN_THREE_PER_WEEK",
                    label: "Plus de 3 fois par semaine",
                  },
                ]}
                placeholder="Sélectionner une option"
                className={`w-full ${
                  errors.rehearsalsPerWeek ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.rehearsalsPerWeek && (
            <p className="text-red-500 text-sm">
              {errors.rehearsalsPerWeek?.message?.toString()}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="practiceType" className="opacity-80 text-sm">
            Type de pratique musicale
          </Label>
          <Controller
            name="practiceType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-wrap gap-2 w-full"
              >
                <Radio
                  title="Non spécifié"
                  id="practice-not-specified"
                  value="NOT_SPECIFIED"
                />
                <Radio title="Loisir" id="hobby" value="HOBBY" />
                <Radio title="En activité" id="active" value="ACTIVE" />
              </RadioGroup>
            )}
          />
          {errors.practiceType && (
            <p className="text-red-500 text-sm">
              {errors.practiceType?.message?.toString()}
            </p>
          )}
        </div>
      </div>

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
            const linkError = getSocialLinkError(platformValue);

            if (!platform) return null;

            return (
              <div key={platformValue}>
                <div className="flex items-center gap-x-3 space-y-1">
                  <div className="flex items-center relative w-full">
                    <div className="justify-center rounded-l-md flex items-center absolute inset-y-0 left-0 opacity-80 w-12 px-3 border-r">
                      <platform.icon className="!size-5" />
                      {/* <span className="text-sm font-medium">
                        {platform.label}
                      </span> */}
                    </div>
                    <Input
                      id={platformValue}
                      name={platformValue}
                      placeholder={platform.placeholder}
                      value={getCurrentUrl(platformValue)}
                      onChange={(e) =>
                        updateSocialLink(platformValue, e.target.value)
                      }
                      onBlur={() => {
                        // Déclencher la validation lors de la perte de focus
                        const currentValue = getCurrentUrl(platformValue);
                        setValue(
                          platformValue as keyof FormValues,
                          currentValue,
                          {
                            shouldValidate: true,
                          }
                        );
                      }}
                      ref={(el) => setInputRef(platformValue, el)}
                      className={`bg-transparent pl-14 ${
                        linkError ? "border-red-500" : ""
                      }`}
                    />
                  </div>

                  <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => handleSocialButtonClick(platformValue)}
                        variant="outline"
                        size="sm"
                        className="text-foreground rounded-full w-10 h-10"
                        type="button"
                        aria-label={`Supprimer le lien ${platform.label}`}
                        ref={(el) => setCloseButtonRef(platformValue, el)}
                      >
                        <Trash className="!size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Supprimer le lien {platform.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {linkError && (
                  <p className="text-red-500 text-sm">{linkError}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
