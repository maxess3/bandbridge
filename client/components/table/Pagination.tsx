import { Button } from "@/components/ui/button";

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
        <Button className="hidden bg-accent border text-foreground">
          <IoChevronBackOutline />
        </Button>
        <Button variant="outline">1</Button>
        <Button variant="ghost">2</Button>
        <Button variant="ghost">3</Button>
        <Button variant="ghost">4</Button>
        <Button variant="ghost">5</Button>
        <Button variant="ghost">...</Button>
        <Button variant="ghost" className="font-semibold">
          Suivant <IoChevronForwardOutline />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
