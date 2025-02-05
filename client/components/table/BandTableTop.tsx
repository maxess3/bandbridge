"use client";

import { useState, useEffect } from "react";

import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoChevronDown } from "react-icons/io5";

import LayoutView from "@/components/table/LayoutView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BandTableTopProps {
  tableLayoutMode: "grid" | "list";
  setTableLayoutMode: React.Dispatch<React.SetStateAction<"grid" | "list">>;
}

function BandTableTop({
  tableLayoutMode,
  setTableLayoutMode,
}: BandTableTopProps) {
  const [inputVal, setInputVal] = useState("");
  const [gradientInput, setGradientInput] = useState(false);

  useEffect(() => {
    if (inputVal.length > 0) {
      setGradientInput(true);
    } else {
      setGradientInput(false);
    }
  }, [inputVal, gradientInput]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex space-x-2">
        <div className="relative w-[265px]">
          <span className="absolute -translate-y-1/2 top-1/2 left-[10px] z-50">
            <HiOutlineLocationMarker className="text-lg" />
          </span>
          <Input
            value={inputVal}
            onChange={handleChangeInput}
            className={`${
              gradientInput
                ? "custom-gradient-border border-transparent !border-2"
                : "custom-gradient-border-focus focus:border-2 focus:px-[35px]"
            } focus:border-transparent focus-visible:ring-0 font-medium  placeholder:font-normal px-9 flex h-10 w-full rounded-md border py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed`}
            placeholder="Choisir une localisation..."
          />
          <span className="absolute -translate-y-1/2 top-1/2 right-[10px] z-50">
            <IoChevronDown className="text-md" />
          </span>
        </div>
        <Button className="relative pr-14 pl-3" variant="outline">
          Style
          <span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
            <IoChevronDown className="text-md" />
          </span>
        </Button>
        <Button className="relative pr-14 pl-3" variant="outline">
          Taille du groupe
          <span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
            <IoChevronDown className="text-md" />
          </span>
        </Button>
        <Button className="relative pr-14 pl-3" variant="outline">
          Instrument
          <span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
            <IoChevronDown className="text-md" />
          </span>
        </Button>
        <Button className="relative pr-14 pl-3" variant="outline">
          Niveau
          <span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
            <IoChevronDown className="text-md" />
          </span>
        </Button>
        <Button className="relative pr-14 pl-3" variant="outline">
          Âge moyen
          <span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
            <IoChevronDown className="text-md" />
          </span>
        </Button>
      </div>
      <LayoutView
        tableLayoutMode={tableLayoutMode}
        setTableLayoutMode={setTableLayoutMode}
      />
    </div>
  );
}

export default BandTableTop;
