"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/Combobox";

const dialogPopupVariants = cva("w-full text-foreground", {
  variants: {
    variant: {
      default: "border bg-background hover:bg-accent",
      secondary:
        "bg-tertiary hover:bg-tertiary-hover hover:underline w-auto text-sm h-8 px-4 rounded-full",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface DialogPopupProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dialogPopupVariants> {
  title?: string;
  icon?: React.ReactNode;
}

export const DialogPopup = React.forwardRef<
  HTMLButtonElement,
  DialogPopupProps
>(({ variant, title, icon, ...props }, ref) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          icon={icon}
          ref={ref}
          {...props}
          className={cn("w-full", dialogPopupVariants({ variant }))}
        >
          {title}
        </Button>
      </DialogTrigger>
      <div className="h-full">
        <DialogContent
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            const contentDiv = document.getElementById("content-div");
            if (contentDiv) {
              contentDiv.focus();
            }
          }}
          id="content-div"
          className="sm:max-w-3xl h-[3/4]"
        >
          <DialogHeader>
            <DialogTitle>
              <div>
                <span className="text-xl">{title}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-6 py-6 space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-2xl">Informations de base</h4>
              <div className="space-y-1.5">
                <Label htmlFor="birthdate" className="opacity-80">
                  Date de naissance
                </Label>
                <Input type="date" id="birthdate" className="opacity-80" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="opacity-80">
                  Ville
                </Label>
                <Combobox />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-2xl">Recherche</h4>
              <div className="space-y-1.5">
                <Label htmlFor="name" className="opacity-80">
                  Type de recherche
                </Label>
                <Combobox />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name" className="opacity-80">
                  Profils recherchés
                </Label>
                <Combobox />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" variant="primary">
              Enregister
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
});

DialogPopup.displayName = "DialogPopup";
