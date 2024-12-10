import BandTable from "@/components/BandTable";

import { Button } from "@/components/ui/button";

export default function Ads() {
  return (
    <div className="flex flex-col justify-center py-14 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            Rejoindre un groupe de musique.
          </h2>
          <p className="opacity-90">
            De nombreux groupes sont à la recherche de la nouvelle pépite.
          </p>
        </div>
        <div className="space-x-2">
          <Button size="lg" className="bg-primary text-sm text-white">
            Publier une annonce
          </Button>
        </div>
      </div>
      <BandTable />
    </div>
  );
}
