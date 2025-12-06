import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { translateGenre } from "@/utils";

interface GenreItemProps {
  genre: string;
  index: number;
  onRemove: (index: number) => void;
  isLast: boolean;
}

export const GenreItem = ({
  genre,
  index,
  onRemove,
  isLast,
}: GenreItemProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8"
        aria-label={`Supprimer ${translateGenre(genre)}`}
      >
        <X className="size-5!" />
      </Button>
      <div
        className={`flex justify-between items-center w-full ${
          !isLast ? "border-b" : ""
        }`}
      >
        <div className="font-semibold h-full py-6">{translateGenre(genre)}</div>
      </div>
    </div>
  );
};
