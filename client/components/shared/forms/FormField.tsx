"use client";

import * as React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: FieldError | string | null;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

export const FormField = ({
  label,
  htmlFor,
  error,
  required = false,
  className,
  labelClassName,
  children,
}: FormFieldProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={htmlFor}
        className={cn("text-sm font-medium opacity-80", labelClassName)}
      >
        {label}
        {required && "*"}
      </Label>
      {children}
    </div>
  );
};

FormField.displayName = "FormField";
