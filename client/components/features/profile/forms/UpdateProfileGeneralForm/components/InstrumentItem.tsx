import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/shared/forms/FormSelect";
import { X } from "lucide-react";

interface InstrumentItemProps {
  instrument: {
    instrumentTypeId: string;
    level: string | null;
    order?: number;
  };
  index: number;
  instrumentName: string;
  onRemove: (index: number) => void;
  onLevelChange: (
    index: number,
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" | null
  ) => void;
  isLast: boolean;
}

export const InstrumentItem = ({
  instrument,
  index,
  instrumentName,
  onRemove,
  onLevelChange,
  isLast,
}: InstrumentItemProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8"
        aria-label={`Supprimer ${instrumentName}`}
      >
        <X className="!size-5" />
      </Button>
      <div
        className={`flex justify-between items-center w-full ${
          !isLast ? "border-b" : ""
        }`}
      >
        <div className="font-semibold h-full py-6">{instrumentName}</div>
        <div className="flex items-center gap-2">
          <FormSelect
            value={instrument.level || ""}
            onChange={(e) =>
              onLevelChange(
                index,
                e.target.value === ""
                  ? null
                  : (e.target.value as
                      | "BEGINNER"
                      | "INTERMEDIATE"
                      | "ADVANCED"
                      | "EXPERT")
              )
            }
            options={[
              { value: "BEGINNER", label: "Débutant" },
              { value: "INTERMEDIATE", label: "Intermédiaire" },
              { value: "ADVANCED", label: "Avancé" },
              { value: "EXPERT", label: "Expert" },
            ]}
            placeholder="Niveau"
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
};
