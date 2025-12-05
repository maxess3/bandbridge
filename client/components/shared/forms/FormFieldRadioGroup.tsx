"use client";

import * as React from "react";
import { FieldError } from "react-hook-form";
import { RadioGroup } from "@/components/ui/radio-group";
import { getErrorMessage } from "./utils/formErrorUtils";

interface FormFieldRadioGroupProps
  extends React.ComponentProps<typeof RadioGroup> {
  error?: FieldError | string | null;
}

export const FormFieldRadioGroup = React.forwardRef<
  HTMLDivElement,
  FormFieldRadioGroupProps
>(({ error, className, children, ...props }, ref) => {
  const errorMessage = getErrorMessage(error);

  return (
    <>
      <RadioGroup {...props} ref={ref} className={className}>
        {children}
      </RadioGroup>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </>
  );
});

FormFieldRadioGroup.displayName = "FormFieldRadioGroup";
