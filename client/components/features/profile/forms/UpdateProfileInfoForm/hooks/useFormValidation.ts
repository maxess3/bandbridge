import { useFormContext } from "react-hook-form";
import { useCallback } from "react";
import { FormValues } from "../types/index";

export const useFormValidation = () => {
  const {
    formState: { errors, isValid, isDirty },
  } = useFormContext<FormValues>();

  const getFieldError = useCallback(
    (fieldName: keyof FormValues) => {
      return errors[fieldName]?.message as string | undefined;
    },
    [errors]
  );

  const hasFieldError = useCallback(
    (fieldName: keyof FormValues) => {
      return !!errors[fieldName];
    },
    [errors]
  );

  const getSocialLinkError = useCallback(
    (platform: string) => {
      return errors[platform as keyof FormValues]?.message as
        | string
        | undefined;
    },
    [errors]
  );

  return {
    errors,
    isValid,
    isDirty,
    getFieldError,
    hasFieldError,
    getSocialLinkError,
  };
};
