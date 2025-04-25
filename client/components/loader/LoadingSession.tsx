import Image from "next/image";
import Logo from "@/public/chordeus_logo.png";

export const LoadingSession = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-4">
			<div className="flex items-center gap-x-2.5">
				<Image src={Logo} alt="Logo" width={46} height={46} />
				<span className="font-satoshi text-[2.1em] font-bold ml-0.5 relative">
					<span className="absolute -top-2 right-0 text-xs">BETA</span>
					Chordeus
				</span>
			</div>
			<div className="w-48 h-1 bg-secondary-hover mt-4 relative">
				<div className="w-1/3 h-1 bg-primary absolute top-0 left-0 animate-loader-animation"></div>
			</div>
		</div>
	);
};
