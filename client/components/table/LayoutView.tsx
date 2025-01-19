import { IoMdGrid } from "react-icons/io";
import { IoList } from "react-icons/io5";

import { Button } from "@/components/ui/button";

interface BandTableTopProps {
  tableLayoutMode: "grid" | "list";
  setTableLayoutMode: React.Dispatch<React.SetStateAction<"grid" | "list">>;
}

function LayoutView({
  tableLayoutMode,
  setTableLayoutMode,
}: BandTableTopProps) {
  return (
    <div className="flex">
      <div className="border border-[#7d8594] dark:border-input flex rounded-md overflow-hidden">
        <Button
          onClick={() => setTableLayoutMode("grid")}
          variant="ghost"
          size="sm"
          className={`rounded-none w-full ${
            tableLayoutMode === "grid" ? "bg-accent" : ""
          }`}
        >
          <IoMdGrid className="opacity-80" />
        </Button>
        <Button
          onClick={() => setTableLayoutMode("list")}
          size="sm"
          variant="ghost"
          className={`rounded-none w-full ${
            tableLayoutMode === "list" ? "bg-accent" : ""
          }`}
        >
          <IoList />
        </Button>
      </div>
    </div>
  );
}

export default LayoutView;
