import { FiPlusCircle } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import BandTableContainer from "@/components/BandTableContainer";

export default function Ads() {
  return (
    <div className="flex flex-col justify-center mt-14 pb-14">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <span className="text-md font-semibold text-primary">
            Rejoindre un groupe
          </span>
          <h2 className="text-3xl font-semibold">
            De nouveaux groupes vous attendent à Paris.
          </h2>
          <p className="opacity-90">
            De nombreux groupes sont à la recherche de la nouvelle pépite.
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant={"outline"}
            size="lg"
            className="text-sm font-semibold hover:bg-secondary/30"
          >
            <FiPlusCircle style={{ width: "18px" }} />
            Déposer une annonce
          </Button>
        </div>
      </div>
      <BandTableContainer />
    </div>
  );
}
