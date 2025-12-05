"use client";

import { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormInput } from "./FormInput";
import { getErrorMessage } from "./utils/formErrorUtils";

interface FormFieldInputProps extends React.ComponentProps<"input"> {
  error?: FieldError | string | null;
}

export const FormFieldInput = forwardRef<HTMLInputElement, FormFieldInputProps>(
  ({ error, className, ...props }, ref) => {
    const errorMessage = getErrorMessage(error);
    const hasError = !!errorMessage;

    return (
      <>
        <FormInput
          {...props}
          ref={ref}
          className={cn(hasError && "border-red-500", className)}
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </>
    );
  }
);

FormFieldInput.displayName = "FormFieldInput";
