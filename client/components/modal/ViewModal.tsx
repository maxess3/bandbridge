"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface ViewModalProps {
  children: React.ReactNode;
  title: string;
  open?: boolean;
  onClose?: () => void;
  footer?: React.ReactNode;
  showOverlay?: boolean;
}

export function ViewModal({
  children,
  title,
  open = true,
  onClose = () => {},
  footer,
  showOverlay = true,
}: ViewModalProps) {
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          showOverlay={showOverlay}
          className="md:max-w-2xl sm:max-w-2xl max-w-full sm:max-h-[85%] max-h-full p-0"
        >
          <DialogHeader>
            <DialogTitle>
              <DialogDescription className="text-xl text-foreground">
                {title}
              </DialogDescription>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto p-6 space-y-6">{children}</div>
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
