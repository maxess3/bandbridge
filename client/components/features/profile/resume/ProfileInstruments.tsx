"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	translateInstrument,
	translateProfession,
} from "@/utils/translations/instrumentTranslations";
import { Badge } from "@/components/ui/badge";

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

const getLevelText = (level: string | null) => {
	switch (level) {
		case "BEGINNER":
			return "Débutant";
		case "INTERMEDIATE":
			return "Intermédiaire";
		case "ADVANCED":
			return "Avancé";
		case "EXPERT":
			return "Expert";
		default:
			return null;
	}
};

export const ProfileInstruments = ({
	instruments,
}: ProfileInstrumentsProps) => {
	if (!instruments || instruments.length === 0) {
		return null;
	}

	// Filtrer les instruments avec une profession et les trier par ordre
	const instrumentsWithProfession = instruments
		.filter((instrument) => instrument.instrumentType.profession)
		.sort((a, b) => a.order - b.order);

	if (instrumentsWithProfession.length === 0) {
		return null;
	}

	// Grouper les instruments par profession
	const instrumentsByProfession = instrumentsWithProfession.reduce(
		(acc, instrument) => {
			const profession = instrument.instrumentType.profession!;
			if (!acc[profession]) {
				acc[profession] = [];
			}
			acc[profession].push(instrument);
			return acc;
		},
		{} as Record<string, typeof instrumentsWithProfession>
	);

	// Convertir en tableau et limiter à 3 professions maximum
	const professionGroups = Object.entries(instrumentsByProfession)
		.slice(0, 3)
		.map(([profession, instruments]) => ({
			profession,
			instruments,
		}));

	return (
		<div className="flex flex-wrap gap-2 mt-1.5">
			{professionGroups.map(({ profession, instruments }, index) => (
				<Tooltip delayDuration={500} key={index}>
					<TooltipTrigger asChild>
						<Badge
							className="font-medium text-base rounded-md"
							variant="outline"
						>
							{translateProfession(profession)}
						</Badge>
					</TooltipTrigger>
					<TooltipContent>
						<div className="space-y-1">
							{instruments.map((instrument, instrumentIndex) => (
								<p key={instrumentIndex}>
									<span className="font-medium">
										{translateInstrument(instrument.instrumentType.name)}
									</span>
									{instrument.level && (
										<span className="font-normal">
											{`: ${getLevelText(instrument.level)}`}
										</span>
									)}
								</p>
							))}
						</div>
					</TooltipContent>
				</Tooltip>
			))}
		</div>
	);
};
