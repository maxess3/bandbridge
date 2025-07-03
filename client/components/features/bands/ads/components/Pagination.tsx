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
      <div className="flex space-x-2">
        <Button className="hidden bg-accent border text-foreground">
          Précédent <IoChevronBackOutline />
        </Button>
        <Button className="font-semibold" variant="outline">
          1
        </Button>
        <Button className="font-semibold" variant="ghost">
          2
        </Button>
        <Button className="font-semibold" variant="ghost">
          3
        </Button>
        <Button className="font-semibold" variant="ghost">
          4
        </Button>
        <Button className="font-semibold" variant="ghost">
          5
        </Button>
        <Button className="font-semibold" variant="ghost">
          ...
        </Button>
        <Button className="font-semibold" variant="ghost">
          Suivant <IoChevronForwardOutline />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
