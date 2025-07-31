"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";

export const FormInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ onKeyDown, ...props }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  return <Input {...props} onKeyDown={handleKeyDown} ref={ref} />;
});

FormInput.displayName = "FormInput";
