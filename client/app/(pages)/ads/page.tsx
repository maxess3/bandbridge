import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiUserSearchLine } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";

import BandTable from "@/components/BandTable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LayoutView from "@/components/LayoutView";
import Pagination from "@/components/Pagination";

export default function Ads() {
  return (
    <div className="flex flex-col justify-center mt-16 pb-14">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold">
            De nouveaux groupes vous attendent.
          </h2>
          <p className="opacity-90">
            De nombreux groupes sont à la recherche de la nouvelle pépite.
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant={"outline"}
            size="lg"
            className="text-sm font-semibold hover:bg-secondary/20"
          >
            <FiPlusCircle style={{ width: "18px" }} />
            Publier une annonce
          </Button>
        </div>
      </div>
      <div className="space-y-6 mt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex space-x-2">
              <div className="relative w-[230px]">
                <span className="absolute -translate-y-1/2 top-1/2 left-[10px]">
                  <HiOutlineLocationMarker className="text-lg" />
                </span>
                <Input
                  className="!text-base pl-9"
                  placeholder="Choisir une localisation"
                />
              </div>
              <div className="relative w-[200px]">
                <span className="absolute -translate-y-1/2 top-1/2 left-[10px]">
                  <RiUserSearchLine className="text-lg" />
                </span>
                <Input
                  className="!text-base pl-9"
                  placeholder="À la recherche de..."
                />
              </div>
            </div>
            <LayoutView />
          </div>
          <BandTable />
        </div>
        <Pagination />
      </div>
    </div>
  );
}
