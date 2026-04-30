"use client";

import { Button } from "@/components/ui/button";
import { ChatIcon, BellIcon } from "@phosphor-icons/react";
import { SearchBar } from "@/components/features/search";
import { DropdownProfile } from "@/components/layout/header/navbar/DropdownProfile";
// import { NavLogo } from "@/components/layout/sidebar/nav-logo";

export function SiteHeader() {
	return (
		<header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
			<div className="flex h-(--header-height) w-full items-center px-1.5 gap-x-1">
				{/* <div className="flex-2 items-center gap-x-3 bg-[purple]"> */}
				{/* <NavLogo /> */}
				{/* <span className="text-2xl font-medium">chordeus</span> */}
				{/* </div> */}
				<div className="flex items-center w-full justify-center">
					<SearchBar />
				</div>
				<div className="flex flex-1 items-center justify-center overflow-hidden"></div>
				<div className="flex items-center justify-end gap-x-2">
					<Button className="h-10 w-10 rounded-md bg-foreground/10">
						<ChatIcon className="size-4.5!" weight="bold" />
					</Button>
					<Button className="h-10 w-10 rounded-md bg-foreground/10">
						<BellIcon className="size-4.5!" weight="bold" />
					</Button>
					<DropdownProfile showText={false} />
				</div>
			</div>
		</header>
	);
}
