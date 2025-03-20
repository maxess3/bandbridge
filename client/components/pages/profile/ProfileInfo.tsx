import { CgSearch } from "react-icons/cg";

export const ProfileInfo = () => (
  <div className="inline-flex items-center py-4 gap-x-2">
    <div className="flex w-full items-center gap-x-2.5">
      <span className="bg-muted-background rounded-full w-10 h-10 inline-flex justify-center items-center">
        <CgSearch className="text-primary" size="1.4em" />
      </span>
      <div className="flex flex-col">
        <span className="font-semibold">Recherche un groupe</span>
        <span className="text-sm opacity-90">
          Guitariste, Bassiste, Batteur
        </span>
      </div>
    </div>
  </div>
);
