import { IoIosSearch } from "react-icons/io";

import { Input } from "@/components/ui/input";
export default function SearchBar() {
  return (
    <div className="w-96 relative">
      <Input
        type="text"
        placeholder="Recherche"
        className="h-full pl-11 pr-6 rounded-full"
      />
      <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-6 opacity-60" />
    </div>
  );
}
