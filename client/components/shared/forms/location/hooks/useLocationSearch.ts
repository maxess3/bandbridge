import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

type LocationFormValues = {
  zipcode?: string;
  city?: string;
};

export const useLocationSearch = () => {
  const { watch, setValue } = useFormContext<LocationFormValues>();
  const zipcode = watch("zipcode");
  const zipcodeString = typeof zipcode === "string" ? zipcode : "";
  const debouncedZipcode: string = useDebounce(zipcodeString, 500);

  const {
    data: cities,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["cities", debouncedZipcode],
    queryFn: async () => {
      if (!debouncedZipcode || debouncedZipcode.length !== 5) return [];
      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?codePostal=${debouncedZipcode}&fields=nom`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.map((item: { nom: string }) => item.nom);
      } catch (error) {
        console.error("Erreur API géolocalisation:", error);
        return [];
      }
    },
    enabled: debouncedZipcode.length === 5,
    retry: 2,
  });

  // Effet pour réinitialiser la ville quand le code postal change
  useEffect(() => {
    if (debouncedZipcode !== zipcode) {
      setValue("city", "");
    }
  }, [debouncedZipcode, zipcode, setValue]);

  return {
    cities,
    isLoading,
    isSuccess,
    debouncedZipcode,
  };
};
