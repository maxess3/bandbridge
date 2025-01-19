import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiUserSearchLine } from "react-icons/ri";
import { IoChevronDown } from "react-icons/io5";

import LayoutView from "@/components/table/LayoutView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BandTableTopProps {
  tableLayoutMode: "grid" | "list";
  setTableLayoutMode: React.Dispatch<React.SetStateAction<"grid" | "list">>;
}

function BandTableTop({
  tableLayoutMode,
  setTableLayoutMode,
}: BandTableTopProps) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex space-x-2">
        <div className="relative w-[250px]">
          <span className="absolute -translate-y-1/2 top-1/2 left-[10px]">
            <HiOutlineLocationMarker className="text-lg" />
          </span>
          <Input
            className="px-9 placeholder:font-normal font-semibold"
            placeholder="Choisir une localisation..."
          />
          <span className="absolute -translate-y-1/2 top-1/2 right-[10px]">
            <IoChevronDown className="text-md" />
          </span>
        </div>
        <div className="relative w-[250px]">
          <span className="absolute -translate-y-1/2 top-1/2 left-[10px]">
            <RiUserSearchLine className="text-lg" />
          </span>
          <Input
            className="px-9 placeholder:font-normal font-semibold"
            placeholder="À la recherche de..."
          />
          <span className="absolute -translate-y-1/2 top-1/2 right-[10px]">
            <IoChevronDown className="text-md" />
          </span>
        </div>
        <Button className="relative pr-14 pl-3" variant="outline">
          Niveau
          <span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
            <IoChevronDown className="text-md" />
          </span>
        </Button>
        <Button className="relative pr-14 pl-3" variant="outline">
          Âge
          <span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
            <IoChevronDown className="text-md" />
          </span>
        </Button>
      </div>
      <LayoutView
        tableLayoutMode={tableLayoutMode}
        setTableLayoutMode={setTableLayoutMode}
      />
    </div>
  );
}

export default BandTableTop;
