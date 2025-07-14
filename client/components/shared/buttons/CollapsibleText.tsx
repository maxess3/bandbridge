import { cn } from "@/lib/utils";
import { useTextCollapse } from "@/hooks/useTextCollapse";
import { useTextTruncated } from "@/hooks/useTextTruncated";

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
	alignButton = "right",
}: CollapsibleTextProps) => {
	const {
		isExpanded,
		toggleExpanded,
		buttonText: currentButtonText,
	} = useTextCollapse(text, {
		buttonText,
	});

	const { isTruncated, textRef, measureRef } = useTextTruncated(text, {
		maxLines,
	});

	// Classes pour l'alignement du bouton
	const buttonContainerClasses = {
		left: "flex justify-start",
		right: "flex justify-end",
		center: "flex justify-center",
	};

	return (
		<div className="flex flex-col">
			{/* Élément d'affichage - applique toujours la troncature initialement */}
			<div
				ref={textRef}
				className={cn("whitespace-pre-wrap", className)}
				style={{
					display: isExpanded ? "block" : "-webkit-box",
					WebkitLineClamp: isExpanded ? "unset" : maxLines,
					WebkitBoxOrient: "vertical" as const,
					overflow: isExpanded ? "visible" : "hidden",
				}}
			>
				{text}
			</div>

			{/* Élément de mesure caché - positionné en dehors du flux normal */}
			<div
				ref={measureRef}
				className={cn("whitespace-pre-wrap", className)}
				style={{
					position: "fixed",
					top: "-9999px",
					left: "-9999px",
					visibility: "hidden",
					height: "auto",
					width: "auto",
					overflow: "visible",
					zIndex: -9999,
					pointerEvents: "none",
				}}
			>
				{text}
			</div>

			{isTruncated && (
				<div className={buttonContainerClasses[alignButton]}>
					<button onClick={toggleExpanded} className={buttonClassName}>
						{currentButtonText}
					</button>
				</div>
			)}
		</div>
	);
};
