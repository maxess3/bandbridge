"use client";

import * as React from "react";
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/Combobox";
import { MultiSelect } from "@/components/MultiSelect";

import { Option } from "multi-select";

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
  const options = [
    { value: "guitar", label: "Guitare" },
    { value: "piano", label: "Piano" },
    { value: "Basse", label: "Basse" },
    { value: "Violon", label: "Violon" },
  ];

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const handleChange = (newValue: unknown) => {
    setSelectedOptions([...(newValue as Option[])]);
  };

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
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const contentDiv = document.getElementById("content-div");
          if (contentDiv) {
            contentDiv.focus();
          }
        }}
        id="content-div"
        className="sm:max-h-[85%] md:max-w-3xl sm:max-w-2xl max-w-full max-h-full p-0"
      >
        <DialogHeader>
          <DialogTitle>
            <div>
              <span className="text-xl">{title}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto px-6 pt-3 pb-6 space-y-6">
          <div className="space-y-1">
            <h4 className="font-semibold text-2xl">Informations de base</h4>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="birthdate" className="opacity-80">
                  Ville
                </Label>
                <Combobox />
              </div>
              <div className="space-y-1.5">
                <MultiSelect
                  placeholder="Sélectionner vos instruments"
                  label="Instruments pratiqués"
                  id="main_instrument"
                  options={options}
                  selectedOptions={selectedOptions}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-2xl">Recherche</h4>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="birthdate" className="opacity-80">
                  Recherche
                </Label>
                <Combobox />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="opacity-80">
                  Recherche 2
                </Label>
                <Combobox />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" variant="primary">
            Enregister
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

DialogPopup.displayName = "DialogPopup";
