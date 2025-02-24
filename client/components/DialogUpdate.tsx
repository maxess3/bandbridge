import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { DialogType } from "@/types/DialogType";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateProfileForm } from "@/components/general/_partials/form/UpdateProfileForm";
import { UpdateSocialLinksForm } from "@/components/general/_partials/form/UpdateSocialLinksForm";

const dialogUpdateVariants = cva("w-full text-foreground", {
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

interface DialogUpdateProps {
  title?: string;
  icon?: React.ReactNode;
  type?: DialogType;
  variant?: "default" | "secondary";
}

export const DialogUpdate = React.forwardRef<
  HTMLButtonElement,
  DialogUpdateProps
>(({ title, icon, type, variant, ...props }, ref) => {
  const renderFields = () => {
    switch (type) {
      case DialogType.Profile:
        return <UpdateProfileForm />;
      case DialogType.SocialLinks:
        return <UpdateSocialLinksForm />;
      default:
        return null;
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          icon={icon}
          ref={ref}
          {...props}
          className={cn("w-full", dialogUpdateVariants({ variant }))}
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          const contentDiv = document.getElementById("content-div");
          if (contentDiv) {
            contentDiv.focus(); // Ajout de la mise au point sur la div
          }
        }}
        id="content-div"
        className="sm:max-h-[85%] md:max-w-2xl sm:max-w-2xl max-w-full max-h-full p-0"
      >
        <DialogHeader>
          <DialogTitle>
            <DialogDescription className="text-xl text-foreground">
              {title}
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto px-6 pt-6 pb-9 space-y-6">
          <form action="">{renderFields()}</form>
        </div>
        <DialogFooter>
          <Button type="submit" variant="primary">
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

DialogUpdate.displayName = "DialogUpdate";
