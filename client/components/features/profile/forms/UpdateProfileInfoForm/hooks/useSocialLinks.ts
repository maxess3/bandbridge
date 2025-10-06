import { useState, useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { SocialLink } from "@/types/Profile";
import { FormValues } from "../types/index";

const SOCIAL_PLATFORMS = [
  "youtube",
  "instagram",
  "tiktok",
  "twitter",
  "soundcloud",
];

export const useSocialLinks = () => {
  const {
    setValue,
    watch,
    formState: { errors },
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

  // Initialiser les liens sociaux depuis les valeurs du formulaire
  useEffect(() => {
    if (initialized.current) return;

    const initialLinks: SocialLink[] = [];
    const initialActiveLinks = new Set<string>();

    SOCIAL_PLATFORMS.forEach((platform) => {
      const url = formValues[platform as keyof FormValues] as string;
      if (url) {
        const linkId = `social-${platform}-${Date.now()}`;
        initialLinks.push({
          id: linkId,
          platform: platform,
          url: url,
        });
        initialActiveLinks.add(platform);
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
      setValue(platform as keyof FormValues, "", {
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

  const handleSocialButtonClick = useCallback(
    (platformValue: string) => {
      if (activeSocialLinks.has(platformValue)) {
        // Désactiver le lien social
        setActiveSocialLinks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(platformValue);
          return newSet;
        });

        setSocialLinks((prev) => {
          return prev.filter((link) => link.platform !== platformValue);
        });
      } else {
        // Activer le lien social
        setActiveSocialLinks((prev) => new Set(prev).add(platformValue));

        const newLink: SocialLink = {
          id: `social-${platformValue}-${Date.now()}`,
          platform: platformValue,
          url: "",
        };
        setSocialLinks((prev) => [...prev, newLink]);

        // Focus automatique sur le nouvel input
        requestAnimationFrame(() => {
          const newInput = inputRefs.current[platformValue];
          if (newInput) {
            newInput.focus();
          }
        });
      }
    },
    [activeSocialLinks]
  );

  const updateSocialLink = useCallback(
    (platform: string, value: string) => {
      setSocialLinks((prev) => {
        return prev.map((link) =>
          link.platform === platform ? { ...link, url: value } : link
        );
      });

      setValue(platform as keyof FormValues, value, {
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const handleSocialLinkBlur = useCallback(
    (platform: string) => {
      const link = socialLinks.find((l) => l.platform === platform);
      if (link) {
        setValue(platform as keyof FormValues, link.url, {
          shouldValidate: true,
        });
      }
    },
    [socialLinks, setValue]
  );

  const getSocialLinkError = useCallback(
    (platform: string) => {
      return errors[platform as keyof FormValues]?.message as
        | string
        | undefined;
    },
    [errors]
  );

  const setInputRef = useCallback(
    (platform: string, element: HTMLInputElement | null) => {
      inputRefs.current[platform] = element;
    },
    []
  );

  const setButtonRef = useCallback(
    (platform: string, element: HTMLButtonElement | null) => {
      buttonRefs.current[platform] = element;
    },
    []
  );

  const setCloseButtonRef = useCallback(
    (platform: string, element: HTMLButtonElement | null) => {
      closeButtonRefs.current[platform] = element;
    },
    []
  );

  return {
    socialLinks,
    activeSocialLinks,
    handleSocialButtonClick,
    updateSocialLink,
    handleSocialLinkBlur,
    getSocialLinkError,
    setInputRef,
    setButtonRef,
    setCloseButtonRef,
  };
};
