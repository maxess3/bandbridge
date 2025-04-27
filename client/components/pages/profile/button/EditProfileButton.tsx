import { Pencil } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const EditProfileButton = ({ username }: { username: string }) => {
	return (
		<Link
			href={`/${username}/edit/profile/general`}
			onClick={() => {
				if (typeof window !== "undefined") {
					window.__lastFocusedElement = document.activeElement;
				}
			}}
			className={buttonVariants({ variant: "outline" })}
		>
			<Pencil className="mr-1 h-4 w-4" />
			Modifier mon profil
		</Link>
	);
};
