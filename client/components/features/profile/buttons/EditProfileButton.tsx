import Link from "next/link";
import { useFocusManager } from "@/contexts/FocusManagerContext";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export const EditProfileButton = ({
  url,
  isOwner,
  className,
}: {
  url: string;
  isOwner: boolean;
  className?: string;
}) => {
  const { captureFocus } = useFocusManager();

  if (!isOwner) return null;

  return (
    <>
      <Link
        href={url}
        onClick={captureFocus}
        className={cn(
          "absolute top-3 right-6 group flex justify-center items-center rounded-full w-12 h-12 hover:bg-hover",
          className
        )}
      >
        <Pencil
          style={{ width: "1.45em", height: "1.45em" }}
          className="text-foreground/80 group-hover:text-foreground"
        />
      </Link>
    </>
  );
};
