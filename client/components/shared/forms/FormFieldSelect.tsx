"use client";

import * as React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormSelect } from "./FormSelect";
import { getErrorMessage } from "./utils/formErrorUtils";

interface FormFieldSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: FieldError | string | null;
}

export const FormFieldSelect = React.forwardRef<
  HTMLSelectElement,
  FormFieldSelectProps
>(({ error, className, ...props }, ref) => {
  const errorMessage = getErrorMessage(error);
  const hasError = !!errorMessage;

  return (
    <>
      <FormSelect
        {...props}
        ref={ref}
        className={cn(hasError && "border-red-500", className)}
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </>
  );
});

FormFieldSelect.displayName = "FormFieldSelect";
