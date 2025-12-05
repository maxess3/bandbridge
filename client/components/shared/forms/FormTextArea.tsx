"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn("rounded-lg text-base!", className)}
        {...props}
      />
    );
  }
);

FormTextArea.displayName = "FormTextArea";

export { FormTextArea };
