"use client";

import * as React from "react";
import { FieldError } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "./utils/formErrorUtils";

interface FormFieldSwitchProps extends React.ComponentProps<typeof Switch> {
  error?: FieldError | string | null;
}

export const FormFieldSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  FormFieldSwitchProps
>(({ error, className, ...props }, ref) => {
  const errorMessage = getErrorMessage(error);

  return (
    <>
      <Switch {...props} ref={ref} className={className} />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </>
  );
});

FormFieldSwitch.displayName = "FormFieldSwitch";
