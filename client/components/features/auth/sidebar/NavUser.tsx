"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { MoreVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { DefaultProfilePicture } from "@/components/features/profile/icons/DefaultProfilePicture";
import { getProfileImageUrl } from "@/utils/utils";
import { FiMoon } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { LuSettings } from "react-icons/lu";
import { RiBugLine } from "react-icons/ri";

export function NavUser() {
	const { data: session } = useSession();

	const router = useRouter();

	const { resolvedTheme, setTheme } = useTheme();
	const [isChecked, setChecked] = useState(
		resolvedTheme === "light" ? false : true
	);

	const { isMobile } = useSidebar();

	function handleClick(e: React.MouseEvent) {
		e.preventDefault();
		if (resolvedTheme === "dark") {
			setChecked(false);
			setTheme("light");
		}
		if (resolvedTheme === "light") {
			setChecked(true);
			setTheme("dark");
		}
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="hover:bg-transparent focus:bg-transparent active:bg-transparent data-[state=open]:bg-transparent"
						>
							<Avatar className="cursor-pointer h-12 w-12">
								<AvatarImage
									src={getProfileImageUrl(
										session?.user.profilePictureKey || "",
										"thumbnail"
									)}
									alt="Profile picture"
									className="rounded-full object-cover pointer-events-none"
								/>
								<AvatarFallback className="bg-secondary pointer-events-none">
									<DefaultProfilePicture className="mt-7 mr-1 w-[50px] h-[50px] text-background" />
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm">
								<span className="truncate font-bold">
									{session?.user.firstName} {session?.user.lastName}
								</span>
								<span className="text-muted-foreground truncate text-xs">
									@{session?.user.username}
								</span>
							</div>
							<MoreVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={8}
					>
						<DropdownMenuItem
							onClick={() => {
								router.push(`/${session?.user.username}`);
							}}
						>
							<div className="w-full space-y-3">
								<div className="flex space-x-2">
									<Avatar className="cursor-pointer">
										<AvatarImage
											src={getProfileImageUrl(
												session?.user.profilePictureKey || "",
												"thumbnail"
											)}
											alt="Profile picture"
											className="rounded-full object-cover pointer-events-none"
											sizes="36px"
										/>
										<AvatarFallback className="bg-secondary pointer-events-none">
											<DefaultProfilePicture className="mt-7 mr-1 !w-[50px] !h-[50px] text-background" />
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col ml-0.5">
										<span className="text-md font-bold">
											{session?.user.firstName} {session?.user.lastName}
										</span>
										<span className="text-sm opacity-80">
											<span className="text-xs">@</span>
											{session?.user.username}
										</span>
									</div>
								</div>
								<span className="w-full border flex rounded-full justify-center py-1 font-medium">
									Voir mon profil
								</span>
							</div>
						</DropdownMenuItem>
						<DropdownMenuGroup>
							<DropdownMenuSeparator className="bg-border" />
							<DropdownMenuItem
								className="flex justify-between"
								onClick={(e) => handleClick(e)}
							>
								<div className="flex gap-x-2.5 items-center text-sm">
									<FiMoon style={{ width: "1.25em", height: "1.25em" }} />
									Mode sombre
								</div>
								<Switch checked={isChecked} />
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push("/me")}>
								<RiBugLine style={{ width: "1.4em", height: "1.4em" }} />
								Signaler un bug
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => router.push("/me")}>
								<LuSettings style={{ width: "1.35em", height: "1.35em" }} />
								Paramètres
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-border" />
							<DropdownMenuItem onClick={() => signOut()}>
								<LuLogOut style={{ width: "1.25em", height: "1.25em" }} />
								Se déconnecter
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
