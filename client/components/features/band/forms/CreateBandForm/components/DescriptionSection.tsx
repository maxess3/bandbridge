import { Label } from "@/components/ui/label";
import { FormTextArea } from "@/components/shared/forms/FormTextArea";

export const DescriptionSection = () => {
  return (
    <div className="space-y-1">
      <Label htmlFor="band-description" className="flex items-center text-sm">
        Description*
      </Label>
      <FormTextArea id="band-description" />
    </div>
  );
};
