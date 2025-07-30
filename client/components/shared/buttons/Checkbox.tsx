import { Label } from "@/components/ui/label";
import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox";

export function Checkbox({
	className,
	title,
	id,
	checked,
	onCheckedChange,
}: {
	className?: string;
	title: string;
	id: string;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}) {
	return (
		<Label
			htmlFor={id}
			className={`border cursor-pointer rounded-md px-3 h-9 flex justify-center flex-col gap-2 [&:has(:checked)]:bg-transparent dark:[&:has(:checked)]:bg-transparent [&:has(:checked)]:border-foreground ${className}`}
		>
			<div className="flex items-center gap-2">
				<CheckboxPrimitive
					id={id}
					checked={checked}
					onCheckedChange={onCheckedChange}
				/>
				{title}
			</div>
		</Label>
	);
}
