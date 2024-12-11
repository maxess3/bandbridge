import { IoMdGrid } from "react-icons/io";
import { IoList } from "react-icons/io5";

import { Button } from "@/components/ui/button";

function LayoutView() {
  return (
    <div className="flex">
      <div className="flex border rounded-md relative before:absolute before:-translate-x-1/2 before:left-1/2 before:h-full before:w-0.5 before:bg-accent">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-r-none w-full hover:bg-secondary/20"
        >
          <IoMdGrid className="opacity-80" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-l-none bg-secondary"
        >
          <IoList />
        </Button>
      </div>
    </div>
  );
}

export default LayoutView;
