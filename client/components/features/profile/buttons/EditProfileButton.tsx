import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useFocusManager } from "@/contexts/FocusManagerContext";

export const EditProfileButton = ({ username }: { username: string }) => {
	const { captureFocus } = useFocusManager();

	return (
		<Link
			href={`/${username}/edit/profile/general`}
			onClick={captureFocus}
			className={buttonVariants({ variant: "outline" })}
		>
			Modifier le résumé
		</Link>
	);
};
