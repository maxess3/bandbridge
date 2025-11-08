"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaXTwitter } from "react-icons/fa6";
import { FiMail, FiCopy, FiFacebook } from "react-icons/fi";
import { toast } from "sonner";
import { useState } from "react";
import { useFocusManager } from "@/contexts/FocusManagerContext";

interface ShareProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  pseudonyme: string;
}

const generateShareUrl = (
  platform: "twitter" | "facebook" | "email",
  url: string,
  text: string,
  pseudonyme: string
): string => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedText}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "email":
      return `mailto:?subject=${encodeURIComponent(
        `Découvrez le profil musical de ${pseudonyme} sur Chordeus`
      )}&body=${encodedText}`;
    default:
      return url;
  }
};

const handleShare = (
  platform: "twitter" | "facebook" | "email",
  url: string,
  text: string,
  pseudonyme: string
) => {
  const shareUrl = generateShareUrl(platform, url, text, pseudonyme);
  window.open(shareUrl, "_blank", "noopener,noreferrer");
};

const handleCopyLink = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Lien copié dans le presse-papiers");
  } catch {
    toast.error("Impossible de copier le lien");
  }
};

export const ShareProfileModal = ({
  open,
  onOpenChange,
  username,
  pseudonyme,
}: ShareProfileModalProps) => {
  const [isCopying, setIsCopying] = useState(false);
  const { restoreFocus } = useFocusManager();
  const profileUrl = `${window.location.origin}/${username}`;
  const shareText = `Découvrez le profil musical de ${pseudonyme} sur Chordeus : ${profileUrl}`;

  const handleCopyClick = async () => {
    setIsCopying(true);
    await handleCopyLink(profileUrl);
    setTimeout(() => setIsCopying(false), 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-w-full sm:max-h-[85%] max-h-full p-0"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          restoreFocus();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <DialogDescription className="text-xl text-foreground font-medium">
              Partager le profil
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 rounded-lg"
              onClick={() =>
                handleShare("twitter", profileUrl, shareText, pseudonyme)
              }
              aria-label="Partager sur Twitter/X"
            >
              <FaXTwitter className="size-6!" />
              <span className="text-sm font-medium">Twitter/X</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 rounded-lg"
              onClick={() =>
                handleShare("facebook", profileUrl, shareText, pseudonyme)
              }
              aria-label="Partager sur Facebook"
            >
              <FiFacebook className="size-6!" />
              <span className="text-sm font-medium">Facebook</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 rounded-lg"
              onClick={() =>
                handleShare("email", profileUrl, shareText, pseudonyme)
              }
              aria-label="Partager par email"
            >
              <FiMail className="size-6!" />
              <span className="text-sm font-medium">Email</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 rounded-lg"
              onClick={handleCopyClick}
              disabled={isCopying}
              aria-label="Copier le lien"
            >
              <FiCopy className="size-6!" />
              <span className="text-sm font-medium">
                {isCopying ? "Copié!" : "Copier le lien"}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
