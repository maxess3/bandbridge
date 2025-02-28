import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

export function Radio({ title, id }: { title: string; id: string }) {
  return (
    <>
      <Label
        htmlFor={id}
        className="border cursor-pointer rounded-md px-3 h-9 flex justify-center flex-col gap-2 [&:has(:checked)]:bg-accent dark:[&:has(:checked)]:bg-accent [&:has(:checked)]:border-primary"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem id={id} value={title} />
          {title}
        </div>
      </Label>
    </>
  );
}
