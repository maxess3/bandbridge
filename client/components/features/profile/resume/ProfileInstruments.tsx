"use client";

import { Badge } from "@/components/ui/badge";
import { translateProfession } from "@/lib/instrumentTranslations";

interface ProfileInstrumentsProps {
	instruments?: {
		instrumentTypeId: string;
		level: string | null;
		order: number;
		instrumentType: {
			name: string;
			profession: string | null;
		};
	}[];
}

const getLevelProgress = (level: string) => {
	switch (level) {
		case "BEGINNER":
			return 25;
		case "INTERMEDIATE":
			return 50;
		case "ADVANCED":
			return 75;
		case "PROFESSIONAL":
			return 100;
		default:
			return 0;
	}
};

const getLevelColor = (level: string) => {
	switch (level) {
		case "BEGINNER":
			return "bg-blue-500";
		case "INTERMEDIATE":
			return "bg-green-500";
		case "ADVANCED":
			return "bg-orange-500";
		case "PROFESSIONAL":
			return "bg-purple-500";
		default:
			return "bg-gray-300";
	}
};

export const ProfileInstruments = ({
	instruments,
}: ProfileInstrumentsProps) => {
	if (!instruments || instruments.length === 0) {
		return null;
	}

	// Récupérer les professions uniques des instruments principaux (ordre 0, 1, 2)
	const mainProfessions = instruments
		.sort((a, b) => a.order - b.order)
		.slice(0, 6)
		.map((instrument) => instrument.instrumentType.profession)
		.filter(Boolean)
		.filter(
			(profession, index, array) => array.indexOf(profession) === index
		) as string[];

	if (mainProfessions.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-2 mt-2">
			{mainProfessions.map((profession, index) => (
				<Badge
					key={index}
					variant="outline"
					className="font-medium text-sm gap-x-2 inline-flex"
				>
					{translateProfession(profession)}
					<div className="w-3 h-3 rounded-full border border-gray-300 relative"></div>
				</Badge>
			))}
		</div>
	);
};
