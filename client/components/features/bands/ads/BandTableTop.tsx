"use client";

import { useState, useEffect } from "react";

import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoChevronDown } from "react-icons/io5";

import LayoutView from "@/components/features/bands/ads/LayoutView";
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
			<div className="flex flex-wrap space-y-2">
				<div className="relative w-[265px] mr-2 mt-2">
					<span className="absolute -translate-y-1/2 top-1/2 left-[10px] z-50">
						<HiOutlineLocationMarker className="text-lg" />
					</span>
					<Input
						value={inputVal}
						onChange={handleChangeInput}
						className={`${
							gradientInput ? "border-foreground !border-2" : "border"
						} focus-visible:ring-0 font-medium placeholder:font-normal px-9 flex h-10 w-full rounded-md border py-1 text-base shadow-sm transition-colors`}
						placeholder="Choisir une localisation..."
					/>
					<span className="absolute -translate-y-1/2 top-1/2 right-[10px] z-50">
						<IoChevronDown className="text-md" />
					</span>
				</div>
				<Button className="relative pr-14 pl-3 mr-2" variant="outline">
					Style
					<span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
						<IoChevronDown className="text-md" />
					</span>
				</Button>
				<Button className="relative pr-14 pl-3 mr-2" variant="outline">
					Taille du groupe
					<span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
						<IoChevronDown className="text-md" />
					</span>
				</Button>
				<Button className="relative pr-14 pl-3 mr-2" variant="outline">
					Instrument
					<span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
						<IoChevronDown className="text-md" />
					</span>
				</Button>
				<Button className="relative pr-14 pl-3 mr-2" variant="outline">
					Niveau
					<span className="absolute -translate-y-1/2 top-1/2 right-[8px]">
						<IoChevronDown className="text-md" />
					</span>
				</Button>
				<Button className="relative pr-14 pl-3 mr-2" variant="outline">
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
