"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DropdownProfile } from "@/components/layout/header/DropdownProfile";

export const NavbarAuthContainer = () => {
	const { setOpenMobile } = useSidebar();

	const handleBurgerClick = () => {
		setOpenMobile(true);
	};

	return (
		<nav className="h-16 bg-[#111111] items-center flex px-6 sticky top-0 z-50 w-full border-b">
			<div className="flex justify-between items-center w-full">
				<div className="flex items-center">
					{/* Burger Menu - Mobile */}
					<Button
						variant="ghost"
						size="icon"
						className="mr-2 md:hidden"
						onClick={handleBurgerClick}
						aria-label="Ouvrir le menu"
					>
						<Menu />
					</Button>

					{/* Logo */}
					<div className="flex items-center gap-x-3 md:hidden">
						<Link
							href="/home"
							className="font-medium flex items-center gap-x-3"
						>
							<span className="text-2xl font-semibold">chordeus</span>
						</Link>
					</div>
				</div>

				{/* Profile Dropdown */}
				<DropdownProfile />
			</div>
		</nav>
	);
};
