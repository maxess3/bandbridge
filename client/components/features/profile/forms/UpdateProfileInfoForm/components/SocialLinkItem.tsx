import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/forms/FormInput";
import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SocialLink } from "@/types/Profile";

interface SocialLinkItemProps {
  platform: {
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    placeholder: string;
  };
  link: SocialLink;
  onUpdate: (platform: string, value: string) => void;
  onRemove: (platform: string) => void;
  error?: string;
  onBlur: (platform: string) => void;
  inputRef: (platform: string, element: HTMLInputElement | null) => void;
  closeButtonRef: (platform: string, element: HTMLButtonElement | null) => void;
}

export const SocialLinkItem = ({
  platform,
  link,
  onUpdate,
  onRemove,
  error,
  onBlur,
  inputRef,
  closeButtonRef,
}: SocialLinkItemProps) => {
  const IconComponent = platform.icon;

  return (
    <div>
      <div className="flex items-center gap-x-3 space-y-1">
        <div className="flex items-center relative w-full">
          <div className="justify-center rounded-l-md flex items-center absolute inset-y-0 left-0 opacity-80 w-12 px-3 border-r">
            <IconComponent className="!size-5" />
          </div>
          <FormInput
            id={platform.value}
            name={platform.value}
            placeholder={platform.placeholder}
            value={link.url}
            onChange={(e) => onUpdate(platform.value, e.target.value)}
            onBlur={() => onBlur(platform.value)}
            ref={(el) => inputRef(platform.value, el)}
            className={`bg-transparent pl-14 ${error ? "border-red-500" : ""}`}
          />
        </div>

        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button
              onClick={() => onRemove(platform.value)}
              variant="outline"
              size="sm"
              className="text-foreground rounded-full w-10 h-10"
              type="button"
              aria-label={`Supprimer le lien ${platform.label}`}
              ref={(el) => closeButtonRef(platform.value, el)}
            >
              <Trash className="!size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Supprimer le lien {platform.label}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
