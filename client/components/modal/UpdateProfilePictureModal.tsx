"use client";

import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";

export function UpdateProfilePictureModal() {
  return (
    <div>
      <Dialog defaultOpen={true} open={true}>
        <DialogOverlay>
          <DialogContent className="md:max-w-2xl sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0">
            <DialogHeader>
              <DialogTitle>
                <DialogDescription className="text-xl text-foreground">
                  Photo de profil
                </DialogDescription>
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto p-6 space-y-6"></div>
            <DialogFooter>
              <div className="flex gap-2">
                <Button variant="outline">Remplacer la photo</Button>
                <Button variant="outline">Supprimer</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
}
