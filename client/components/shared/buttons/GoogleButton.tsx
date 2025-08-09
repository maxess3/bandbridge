import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";

export const GoogleButton = ({ title }: { title: string }) => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const handleGoogleSignIn = () => {
		signIn("google", {
			callbackUrl: callbackUrl,
		});
	};

	return (
		<Button
			onClick={handleGoogleSignIn}
			size="lg"
			variant="outline"
			className="w-full font-medium"
		>
			<FcGoogle style={{ width: "1.4em", height: "1.4em" }} />
			{title}
		</Button>
	);
};
