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
      <div className="flex rounded-md relative before:absolute before:-translate-x-1/2 before:left-1/2 before:h-full before:w-0.5 before:bg-secondary">
        <Button
          onClick={() => setTableLayoutMode("grid")}
          variant="ghost"
          size="sm"
          className={`rounded-r-none border w-full hover:bg-secondary/30 ${
            tableLayoutMode === "grid" ? "bg-secondary hover:bg-secondary" : ""
          }`}
        >
          <IoMdGrid className="opacity-80" />
        </Button>
        <Button
          onClick={() => setTableLayoutMode("list")}
          size="sm"
          variant="ghost"
          className={`rounded-l-none border w-full hover:bg-secondary/30 ${
            tableLayoutMode === "list" ? "bg-secondary hover:bg-secondary" : ""
          }`}
        >
          <IoList />
        </Button>
      </div>
    </div>
  );
}

export default LayoutView;
