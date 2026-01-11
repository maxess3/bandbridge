"use client";

import Link from "next/link";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";

export function NavLogo() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="flex items-center">
					<Link
						href={"/home"}
						className="font-medium flex items-center gap-x-2 w-full"
					>
						<Image src={Logo} alt="Logo" className="size-8.5" />
						<span className="text-2xl font-medium md:block sm:hidden">
							chordeus
						</span>
						<span className="text-xs font-medium bg-secondary px-1.5 py-1 rounded-md">
							ALPHA
						</span>
					</Link>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
