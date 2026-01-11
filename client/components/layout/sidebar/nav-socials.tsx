import {
	XLogoIcon,
	FacebookLogoIcon,
	InstagramLogoIcon,
	YoutubeLogoIcon,
} from "@phosphor-icons/react";

export const NavSocials = () => {
	return (
		<div className="flex justify-center pt-5 pb-3 gap-5 border-t">
			<div className="text-sm font-medium opacity-50">
				<XLogoIcon weight="bold" className="size-5" />
			</div>
			<div className="text-sm font-medium opacity-50">
				<InstagramLogoIcon weight="bold" className="size-5" />
			</div>
			<div className="text-sm font-medium opacity-50">
				<FacebookLogoIcon weight="bold" className="size-5" />
			</div>
			<div className="text-sm font-medium opacity-50">
				<YoutubeLogoIcon weight="bold" className="size-5" />
			</div>
		</div>
	);
};
