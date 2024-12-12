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
        <Button className="hidden bg-outline border shadow-sm text-foreground hover:bg-accent">
          <IoChevronBackOutline />
        </Button>
        <Button className="bg-outline border text-foreground shadow-sm hover:bg-secondary/20">
          1
        </Button>
        <Button className="bg-outline text-foreground shadow-sm hover:bg-secondary/20">
          2
        </Button>
        <Button className="bg-outline text-foreground shadow-sm hover:bg-secondary/20">
          3
        </Button>
        <Button className="bg-outline text-foreground shadow-sm hover:bg-secondary/20">
          4
        </Button>
        <Button className="bg-outline text-foreground shadow-sm hover:bg-secondary/20">
          5
        </Button>
        <Button className="bg-outline text-foreground shadow-sm hover:bg-secondary/20">
          ...
        </Button>
        <Button className="bg-outline text-foreground shadow-sm hover:bg-secondary/20 font-medium">
          Suivant <IoChevronForwardOutline />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
