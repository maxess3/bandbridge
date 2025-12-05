"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export const FormInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ onKeyDown, className, ...props }, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  return (
    <Input
      {...props}
      onKeyDown={handleKeyDown}
      ref={ref}
      className={cn("h-10.5 rounded-lg", className)}
    />
  );
});

FormInput.displayName = "FormInput";
