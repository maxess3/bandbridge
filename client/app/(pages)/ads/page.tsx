import { FiPlusCircle } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import BandTableContainer from "@/components/table/BandTableContainer";

export default function Ads() {
  return (
    <div className="flex flex-col justify-center mt-12 pb-12">
      <div className="flex justify-between items-center">
        <div className="space-y-2.5">
          <span className="text-sm font-semibold bg-accent px-4 py-1 rounded-full inline-flex">
            🔥 +300 annonces publiées
          </span>
          <div className="space-y-1.5">
            <h2 className="text-3xl font-semibold">
              De nouveaux groupes vous attendent à Paris.
            </h2>
            <p className="opacity-90">
              De nombreux groupes sont à la recherche de la nouvelle pépite.
            </p>
          </div>
        </div>
        <div>
          <Button variant={"outline"}>
            <FiPlusCircle />
            Créer une annonce
          </Button>
        </div>
      </div>
      <BandTableContainer />
    </div>
  );
}
