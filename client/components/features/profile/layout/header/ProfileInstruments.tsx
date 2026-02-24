"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { translateInstrument, translateRole } from "@/utils";

interface ProfileInstrumentsProps {
  instruments?: {
    instrumentTypeId: string;
    level: string | null;
    order: number;
    instrumentType: {
      name: string;
      role?: { id: string; name: string } | null;
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

  // Filtrer les instruments avec un rôle et les trier par ordre
  const roleName = (inst: (typeof instruments)[0]) =>
    inst.instrumentType.role?.name ?? null;
  const instrumentsWithRole = instruments
    .filter((instrument) => roleName(instrument))
    .sort((a, b) => a.order - b.order);

  if (instrumentsWithRole.length === 0) {
    return null;
  }

  // Grouper les instruments par rôle (nom du rôle)
  const instrumentsByRole = instrumentsWithRole.reduce(
    (acc, instrument) => {
      const name = roleName(instrument)!;
      if (!acc[name]) {
        acc[name] = [];
      }
      acc[name].push(instrument);
      return acc;
    },
    {} as Record<string, typeof instrumentsWithRole>
  );

  // Convertir en tableau et limiter à 3 rôles maximum
  const roleGroups = Object.entries(instrumentsByRole)
    .slice(0, 3)
    .map(([roleNameKey, insts]) => ({
      roleName: roleNameKey,
      instruments: insts,
    }));

  return (
    <div className="flex flex-wrap gap-2 mt-1.5">
      {roleGroups.map(({ roleName: name, instruments: insts }, index) => (
        <Tooltip delayDuration={500} key={index}>
          <TooltipTrigger asChild>
            <span className="px-0 font-medium text-lg border-none">
              {translateRole(name)}
              {index < roleGroups.length - 1 && ","}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {insts.map((instrument, instrumentIndex) => (
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
