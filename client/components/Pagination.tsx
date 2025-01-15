import { Button } from "./ui/button";

import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

function Pagination() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex">
        <p>
          <span className="font-medium">3000</span> annonces.
        </p>
      </div>
      <div className="flex space-x-1">
        <Button className="hidden bg-accent border text-foreground hover:bg-secondary/30">
          <IoChevronBackOutline />
        </Button>
        <Button className="bg-outline border text-foreground hover:bg-secondary/30 shadow-none">
          1
        </Button>
        <Button className="bg-outline text-foreground hover:bg-secondary/30 shadow-none">
          2
        </Button>
        <Button className="bg-outline text-foreground hover:bg-secondary/30 shadow-none">
          3
        </Button>
        <Button className="bg-outline text-foreground hover:bg-secondary/30 shadow-none">
          4
        </Button>
        <Button className="bg-outline text-foreground hover:bg-secondary/30 shadow-none">
          5
        </Button>
        <Button className="bg-outline text-foreground hover:bg-secondary/30 shadow-none">
          ...
        </Button>
        <Button className="bg-outline text-foreground hover:bg-secondary/40 font-medium shadow-none">
          Suivant <IoChevronForwardOutline />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
