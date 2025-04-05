import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-md inline-flex items-center justify-center gap-2 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-[white] hover:bg-primary-hover transition-colors",
        default: "bg-primary",
        destructive: "bg-destructive text-destructive-foreground shadow-sm",
        outline: "border hover:bg-hover transition-colors",
        secondary:
          "bg-secondary text-sm rounded-full font-medium hover:bg-secondary-hover transition-colors",
        ghost: "text-foreground hover:bg-hover transition-colors",
        link: "text-primary underline-offset-4",
      },
      size: {
        default: "px-4 py-2",
        xs: "h-8 px-3",
        sm: "h-9 px-3 text-sm",
        md: "h-9 px-4",
        lg: "h-10 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, icon, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
