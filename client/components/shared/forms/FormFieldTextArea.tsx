"use client";

import * as React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormTextArea } from "./FormTextArea";
import { getErrorMessage } from "./utils/formErrorUtils";

interface FormFieldTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError | string | null;
}

export const FormFieldTextArea = React.forwardRef<
  HTMLTextAreaElement,
  FormFieldTextAreaProps
>(({ error, className, ...props }, ref) => {
  const errorMessage = getErrorMessage(error);
  const hasError = !!errorMessage;

  return (
    <>
      <FormTextArea
        {...props}
        ref={ref}
        className={cn(hasError && "border-red-500", className)}
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </>
  );
});

FormFieldTextArea.displayName = "FormFieldTextArea";
