import { useState } from "react";

interface UseTextCollapseOptions {
	buttonText?: {
		expanded?: string;
		collapsed?: string;
	};
}

interface UseTextCollapseReturn {
	isExpanded: boolean;
	toggleExpanded: () => void;
	buttonText: string;
}

export const useTextCollapse = (
	text: string,
	options: UseTextCollapseOptions = {}
): UseTextCollapseReturn => {
	const {
		buttonText = {
			expanded: "...voir moins",
			collapsed: "...voir plus",
		},
	} = options;

	const [isExpanded, setIsExpanded] = useState(false);

	// Texte du bouton
	const currentButtonText = isExpanded
		? buttonText.expanded || "...voir moins"
		: buttonText.collapsed || "...voir plus";

	// Fonction pour basculer l'état
	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	return {
		isExpanded,
		toggleExpanded,
		buttonText: currentButtonText,
	};
};
