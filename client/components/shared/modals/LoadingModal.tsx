"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";

interface LoadingModalProps {
  children: React.ReactNode;
  route?: string;
  title: string;
  open?: boolean;
}

export function LoadingModal({
  children,
  route,
  title,
  open = true,
}: LoadingModalProps) {
  const router = useRouter();
  const handleOpenChange = () => {
    if (route) {
      router.push(route);
    } else {
      router.back();
    }
  };

  return (
    <div>
      <Dialog defaultOpen={open} open={open} onOpenChange={handleOpenChange}>
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
              {children}
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
}
