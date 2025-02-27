"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ModalProps {
  children: React.ReactNode;
  route?: string;
  title: string;
}

export function Modal({ children, route, title }: ModalProps) {
  const router = useRouter();
  const handleOpenChange = () => {
    if (route) {
      router.push(route);
    } else {
      router.back();
    }
  };
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className="md:max-w-2xl sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0">
          <DialogHeader>
            <DialogTitle>
              <DialogDescription className="text-xl text-foreground">
                {title}
              </DialogDescription>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-6 pt-6 pb-9 space-y-6">
            <form id="modalForm">{children}</form>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              variant="primary"
              form="modalForm"
              onClick={handleSubmit}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
