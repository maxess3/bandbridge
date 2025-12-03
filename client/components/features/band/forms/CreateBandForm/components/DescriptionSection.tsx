import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const DescriptionSection = () => {
  return (
    <div className="space-y-1">
      <Label htmlFor="bandDescription" className="flex items-center text-sm">
        Description du groupe
      </Label>
      <Textarea
        id="bandDescription"
        className="bg-transparent text-base md:text-base min-h-[100px]"
      />
    </div>
  );
};
