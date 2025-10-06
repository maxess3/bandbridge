import { useState, useRef, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../types/index";

export const useGenres = () => {
  const { watch, setValue } = useFormContext<FormValues>();
  const formGenres = watch("genres");

  const [isAddingGenre, setIsAddingGenre] = useState(false);
  const genreInputRef = useRef<HTMLInputElement>(null);
  const addGenreButtonRef = useRef<HTMLButtonElement>(null);
  const accessibilityGenreFocusRef = useRef<HTMLDivElement>(null);

  const handleAddGenre = useCallback(() => {
    setIsAddingGenre(true);
    requestAnimationFrame(() => genreInputRef.current?.focus());
  }, []);

  const handleGenreSelect = useCallback(
    (genreId: string) => {
      const isAlreadyAdded = formGenres.includes(genreId);
      if (isAlreadyAdded) return;

      setValue("genres", [...formGenres, genreId], { shouldDirty: true });
      setIsAddingGenre(false);
      requestAnimationFrame(() => addGenreButtonRef.current?.focus());
    },
    [formGenres, setValue]
  );

  const handleRemoveGenre = useCallback(
    (index: number) => {
      const updatedGenres = formGenres.filter((_, i) => i !== index);
      setValue("genres", updatedGenres, { shouldDirty: true });
      requestAnimationFrame(() => accessibilityGenreFocusRef.current?.focus());
    },
    [formGenres, setValue]
  );

  return {
    formGenres,
    isAddingGenre,
    setIsAddingGenre,
    genreInputRef,
    addGenreButtonRef,
    accessibilityGenreFocusRef,
    handleAddGenre,
    handleGenreSelect,
    handleRemoveGenre,
  };
};
