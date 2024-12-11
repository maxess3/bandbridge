import BandTable from "@/components/BandTable";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";

export default function Ads() {
  return (
    <div className="flex flex-col justify-center mt-16 pb-14">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            Envie de jouer ? De nouveaux groupes vous attendent.
          </h2>
          <p className="opacity-90">
            De nombreux groupes sont à la recherche de la nouvelle pépite.
          </p>
        </div>
        <div className="space-x-2">
          <Button
            size="lg"
            className="bg-primary text-sm text-white font-semibold"
          >
            Publier une annonce
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <BandTable />
      </div>
      <div className="mt-6">
        <Pagination />
      </div>
    </div>
  );
}
