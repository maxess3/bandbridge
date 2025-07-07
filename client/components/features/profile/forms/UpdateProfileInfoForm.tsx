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
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { RiSoundcloudFill } from "react-icons/ri";
import { useState, useCallback, useEffect, useRef } from "react";
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
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<FormValues>();

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const initialized = useRef(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Obtenir les valeurs actuelles du formulaire
  const formValues = watch();
  const descriptionValue = formValues.description || "";
  const maxChars = 2600;
  const currentChars = descriptionValue.length;

  // Synchroniser les liens sociaux avec le formulaire
  const updateFormSocialLinks = useCallback(
    (links: SocialLink[]) => {
      // Réinitialiser tous les champs sociaux
      SOCIAL_PLATFORMS.forEach((platform) => {
        setValue(platform.value as keyof FormValues, "", {
          shouldDirty: true,
          shouldValidate: true,
        });
      });

      // Mettre à jour avec les liens actuels
      links.forEach((link) => {
        if (link.platform && link.url) {
          setValue(link.platform as keyof FormValues, link.url, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      });
    },
    [setValue]
  );

  // Initialiser les liens sociaux depuis les valeurs du formulaire
  useEffect(() => {
    if (initialized.current) return;

    const initialLinks: SocialLink[] = [];

    SOCIAL_PLATFORMS.forEach((platform) => {
      const url = formValues[platform.value as keyof FormValues] as string;
      if (url) {
        initialLinks.push({
          id: `social-${platform.value}-${Date.now()}`,
          platform: platform.value,
          url: url,
        });
      }
    });

    setSocialLinks(initialLinks);
    initialized.current = true;
  }, [formValues]);

  const addSocialLink = useCallback(() => {
    // Vérifier si on a atteint le maximum de liens sociaux
    if (socialLinks.length >= SOCIAL_PLATFORMS.length) {
      return;
    }

    const newLink: SocialLink = {
      id: `social-${Date.now()}`,
      platform: "",
      url: "",
    };
    const updatedLinks = [...socialLinks, newLink];
    setSocialLinks(updatedLinks);
    updateFormSocialLinks(updatedLinks);

    // Focus sur le nouveau lien créé
    setTimeout(() => {
      const selectElement = document.querySelector(
        `[data-link-id="${newLink.id}"] select`
      ) as HTMLSelectElement;
      selectElement?.focus();
    }, 0);
  }, [socialLinks, updateFormSocialLinks]);

  const removeSocialLink = useCallback(
    (id: string) => {
      const currentIndex = socialLinks.findIndex((link) => link.id === id);
      const updatedLinks = socialLinks.filter((link) => link.id !== id);
      setSocialLinks(updatedLinks);
      updateFormSocialLinks(updatedLinks);

      // Gestion du focus après suppression
      setTimeout(() => {
        if (updatedLinks.length === 0) {
          // Si plus de liens, focus sur le bouton "Ajouter un lien"
          addButtonRef.current?.focus();
        } else {
          // Sinon, focus sur le lien précédent ou le premier lien
          const targetIndex = Math.max(0, currentIndex - 1);
          const targetLink = updatedLinks[targetIndex];
          if (targetLink) {
            // Focus sur le select du lien cible
            const selectElement = document.querySelector(
              `[data-link-id="${targetLink.id}"] select`
            ) as HTMLSelectElement;
            selectElement?.focus();
          }
        }
      }, 0);
    },
    [socialLinks, updateFormSocialLinks]
  );

  const updateSocialLink = useCallback(
    (id: string, field: "platform" | "url", value: string) => {
      const updatedLinks = socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      );

      // Si on change de plateforme, réinitialiser les liens qui utilisent maintenant une plateforme non disponible
      if (field === "platform") {
        const usedPlatforms = updatedLinks
          .filter((link) => link.platform)
          .map((link) => link.platform);

        // Trouver les liens qui ont une plateforme qui n'est plus disponible
        const invalidLinks = updatedLinks.filter(
          (link) =>
            link.platform &&
            usedPlatforms.filter((p) => p === link.platform).length > 1
        );

        // Réinitialiser ces liens
        invalidLinks.forEach((invalidLink) => {
          const linkIndex = updatedLinks.findIndex(
            (link) => link.id === invalidLink.id
          );
          if (linkIndex !== -1) {
            updatedLinks[linkIndex] = { ...invalidLink, platform: "", url: "" };
          }
        });
      }

      setSocialLinks(updatedLinks);
      updateFormSocialLinks(updatedLinks);

      // Déclencher la validation immédiatement pour le champ modifié
      if (field === "url") {
        const link = updatedLinks.find((l) => l.id === id);
        if (link && link.platform) {
          setValue(link.platform as keyof FormValues, value, {
            shouldValidate: true,
          });
        }
      }
    },
    [socialLinks, updateFormSocialLinks, setValue]
  );

  const getPlatformPlaceholder = (platformValue: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.value === platformValue);
    return platform?.placeholder || "";
  };

  const getAvailablePlatforms = (currentLinkId: string) => {
    const usedPlatforms = socialLinks
      .filter((link) => link.id !== currentLinkId && link.platform)
      .map((link) => link.platform);

    return SOCIAL_PLATFORMS.filter(
      (platform) => !usedPlatforms.includes(platform.value)
    );
  };

  // Fonction pour obtenir l'erreur d'un lien social spécifique
  const getSocialLinkError = (platform: string) => {
    return errors[platform as keyof FormValues]?.message as string | undefined;
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
        <div className="flex justify-between items-center">
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
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

      <div className="space-y-4">
        <h4 className="font-semibold text-xl">Expérience musicale</h4>
        <div className="space-y-1.5">
          <Label htmlFor="concertsPlayed" className="opacity-80">
            Concerts joués
          </Label>
          <Controller
            name="concertsPlayed"
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
                  id="not-specified"
                  value="NOT_SPECIFIED"
                />
                <Radio
                  title="Moins de 10"
                  id="less-than-10"
                  value="LESS_THAN_10"
                />
                <Radio title="10 à 50" id="ten-to-fifty" value="TEN_TO_FIFTY" />
                <Radio
                  title="50 à 100"
                  id="fifty-to-hundred"
                  value="FIFTY_TO_HUNDRED"
                />
                <Radio
                  title="100+"
                  id="more-than-hundred"
                  value="MORE_THAN_HUNDRED"
                />
              </RadioGroup>
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rehearsalsPerWeek" className="opacity-80">
            Répétitions par semaine
          </Label>
          <Controller
            name="rehearsalsPerWeek"
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
                  id="rehearsals-not-specified"
                  value="NOT_SPECIFIED"
                />
                <Radio
                  title="1 fois par semaine"
                  id="once-per-week"
                  value="ONCE_PER_WEEK"
                />
                <Radio
                  title="2-3 fois par semaine"
                  id="two-to-three-per-week"
                  value="TWO_TO_THREE_PER_WEEK"
                />
                <Radio
                  title="Plus de 3 fois par semaine"
                  id="more-than-three-per-week"
                  value="MORE_THAN_THREE_PER_WEEK"
                />
              </RadioGroup>
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="practiceType" className="opacity-80">
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
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-xl">Liens sociaux</h4>

        <div className="space-y-3">
          {socialLinks.map((link) => {
            const linkError = getSocialLinkError(link.platform);
            return (
              <div key={link.id} className="space-y-2" data-link-id={link.id}>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-[170px]">
                    <NativeSelect
                      value={link.platform}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateSocialLink(link.id, "platform", value);
                        // Déclencher la validation après le changement de plateforme
                        if (link.url) {
                          setValue(value as keyof FormValues, link.url, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      options={getAvailablePlatforms(link.id).map(
                        (platform) => ({
                          value: platform.value,
                          label: platform.label,
                        })
                      )}
                      placeholder="Plateforme"
                    />
                  </div>

                  <div className="flex-1">
                    {link.platform && (
                      <Input
                        placeholder={getPlatformPlaceholder(link.platform)}
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(link.id, "url", e.target.value)
                        }
                        onBlur={() => {
                          // Déclencher la validation lors de la perte de focus
                          const currentValue = link.url;
                          setValue(
                            link.platform as keyof FormValues,
                            currentValue,
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                        className={`bg-transparent ${
                          linkError ? "border-red-500" : ""
                        }`}
                      />
                    )}
                  </div>

                  <Button
                    onClick={() => removeSocialLink(link.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    type="button"
                  >
                    <X />
                  </Button>
                </div>
                {linkError && (
                  <p className="text-red-500 text-sm px-3">{linkError}</p>
                )}
              </div>
            );
          })}
        </div>
        <Button
          ref={addButtonRef}
          onClick={addSocialLink}
          variant="secondary"
          className="flex items-center gap-2"
          disabled={socialLinks.length >= SOCIAL_PLATFORMS.length}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Ajouter un lien
        </Button>
      </div>
    </div>
  );
};
