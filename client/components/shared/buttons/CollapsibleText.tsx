import { cn } from "@/lib/utils";
import { useTextCollapse } from "@/hooks/useTextCollapse";

interface CollapsibleTextProps {
	text: string;
	maxLines?: number;
	className?: string;
	buttonClassName?: string;
	buttonText?: {
		expanded?: string;
		collapsed?: string;
	};
	showButton?: boolean;
	alignButton?: "left" | "right" | "center";
}

export const CollapsibleText = ({
	text,
	maxLines = 5,
	className = "",
	buttonClassName = "text-sm text-foreground/70 font-medium mt-2",
	buttonText,
	showButton = true,
	alignButton = "right",
}: CollapsibleTextProps) => {
	const {
		isExpanded,
		toggleExpanded,
		buttonText: currentButtonText,
	} = useTextCollapse(text, {
		buttonText,
	});

	// Classes pour l'alignement du bouton
	const buttonContainerClasses = {
		left: "flex justify-start",
		right: "flex justify-end",
		center: "flex justify-center",
	};

	return (
		<div className="flex flex-col">
			<div
				className={cn("whitespace-pre-wrap", className)}
				style={{
					...(showButton &&
						!isExpanded &&
						({
							display: "-webkit-box",
							WebkitLineClamp: maxLines,
							WebkitBoxOrient: "vertical" as const,
							overflow: "hidden",
						} as React.CSSProperties)),
				}}
			>
				{text}
			</div>
			{showButton && (
				<div className={buttonContainerClasses[alignButton]}>
					<button onClick={toggleExpanded} className={buttonClassName}>
						{currentButtonText}
					</button>
				</div>
			)}
		</div>
	);
};
