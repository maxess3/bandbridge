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
      <div className="flex space-x-2">
        {/* <Button className="bg-outline border shadow-sm text-foreground hover:bg-accent">
          <IoChevronBackOutline />
        </Button> */}
        <Button className="bg-outline border text-foreground shadow-sm hover:bg-accent">
          1
        </Button>
        <Button className="bg-outline border text-foreground shadow-sm hover:bg-accent">
          2
        </Button>
        <Button className="bg-outline border text-foreground shadow-sm hover:bg-accent">
          3
        </Button>
        <Button className="bg-outline border text-foreground shadow-sm hover:bg-accent">
          4
        </Button>
        <Button className="bg-outline border text-foreground shadow-sm hover:bg-accent">
          5
        </Button>
        <Button className="bg-outline border text-foreground shadow-sm hover:bg-accent">
          250
        </Button>
        <Button className="bg-outline border text-foreground shadow-sm hover:bg-accent">
          <IoChevronForwardOutline />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
