import { IoIosSearch } from "react-icons/io";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useSearchAutocomplete } from "@/hooks/useSearchAutocomplete";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const { data } = useSearchAutocomplete(search);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="max-w-[700px] w-full relative">
      <Input
        type="text"
        placeholder="Recherche"
        className="h-full pl-11 pr-6 rounded-full"
        onChange={handleChange}
      />
      <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-6 opacity-60" />
    </div>
  );
}
