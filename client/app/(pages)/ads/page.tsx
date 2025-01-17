import { FiPlusCircle } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import BandTableContainer from "@/components/BandTableContainer";

export default function Ads() {
  return (
    <div className="flex flex-col justify-center mt-14 pb-14">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <span className="text-sm font-bold bg-secondary px-4 py-1 rounded-full drop-shadow-sm inline-flex">
            🔥 +300 annonces publiées
          </span>
          <h2 className="text-3xl font-bold font-maven">
            De nouveaux groupes vous attendent à Paris.
          </h2>
          <p className="opacity-90">
            De nombreux groupes sont à la recherche de la nouvelle pépite.
          </p>
        </div>
        <div className="space-x-2">
          <Button variant={"outline"} className="font-semibold">
            <FiPlusCircle />
            Créer une annonce
          </Button>
        </div>
      </div>
      <BandTableContainer />
    </div>
  );
}
