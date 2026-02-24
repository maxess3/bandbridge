import { forwardRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/utils";
import { translateRole } from "@/utils";
import { AiFillSafetyCertificate } from "react-icons/ai";
import {
  AutocompleteDropdownProps,
  AutocompleteSearchResult,
} from "@/types/Search";
import { Instrument } from "@/types/Instrument";

const AutocompleteDropdown = forwardRef<
  HTMLDivElement,
  AutocompleteDropdownProps
>(
  (
    {
      profiles,
      onProfileSelect,
      onViewAllResults,
      selectedIndex = -1,
      onKeyDown,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="absolute w-full max-h-[calc(100vh-200px)] bg-popover border rounded-md mt-1"
      >
        <div
          role="listbox"
          className="max-h-[calc(100vh-200px)] overflow-y-auto"
          onKeyDown={onKeyDown}
          tabIndex={-1}
        >
          {profiles.map((profile: AutocompleteSearchResult, index) => {
            const imageURL = getImageUrl(
              profile.profilePictureKey || "",
              "small"
            );

            const instrumentsWithRole =
              profile.instruments?.filter((instrument: Instrument) =>
                instrument.instrumentType.role?.name
              ) || [];

            const isSelected = index === selectedIndex;

            return (
              <div
                key={profile.id}
                className={`last:border-b flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-foreground/10 border-2 border-red-500"
                    : "hover:bg-secondary border-2 border-transparent"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Empêcher le focus de l'input
                  onProfileSelect(profile);
                }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={imageURL || undefined}
                    alt={profile.pseudonyme}
                  />
                  <AvatarFallback className="bg-foreground/40 text-foreground opacity-80 text-sm font-medium">
                    {profile.pseudonyme.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="font-semibold flex items-center text-foreground truncate">
                      <span className="inline-flex items-center gap-1">
                        {profile.pseudonyme}
                        <AiFillSafetyCertificate className="size-4 text-blue-500" />
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 text-sm text-foreground opacity-80">
                    {instrumentsWithRole.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {instrumentsWithRole
                          .slice(0, 1)
                          .map((instrument: Instrument) => (
                            <span
                              key={instrument.instrumentTypeId}
                              className="truncate"
                            >
                              {translateRole(
                                instrument.instrumentType.role?.name ?? ""
                              )}
                            </span>
                          ))}
                        {instrumentsWithRole.length > 3 && (
                          <Badge
                            variant="outline"
                            className="font-normal px-2 py-0.5 ml-0.5"
                          >
                            +{" "}
                            <span className="font-medium ml-0.5">
                              {instrumentsWithRole.length - 1}
                            </span>
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm opacity-60">
                        Aucun instrument
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className={profiles.length > 0 ? "border-t" : ""}>
            <button
              className={`w-full flex items-center justify-center py-2.5 px-3 font-medium transition-colors border-2 ${
                selectedIndex === profiles.length
                  ? "bg-foreground/10 border-red-500"
                  : "hover:bg-secondary border-transparent"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                if (onViewAllResults) {
                  onViewAllResults();
                }
              }}
            >
              Voir tous les résultats
            </button>
          </div>
        </div>
      </div>
    );
  }
);

AutocompleteDropdown.displayName = "AutocompleteDropdown";

export default AutocompleteDropdown;
