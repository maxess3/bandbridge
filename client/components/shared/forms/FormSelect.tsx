"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, options, placeholder, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
      onKeyDown?.(e);
    };

    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "h-10.5 w-full rounded-lg border border-input bg-transparent px-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none leading-10",
            className
          )}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Icône triangle */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export { FormSelect };
