import Link from "next/link";
import { saveLastFocusedElement, formatDateToMonthYear } from "@/utils/utils";
import { Pencil } from "lucide-react";
import { Profile } from "@/types/Profile";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaInstagram } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { RiSoundcloudFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { CollapsibleText } from "@/components/shared/buttons/CollapsibleText";

const SOCIAL_PLATFORMS = [
	{
		key: "youtube",
		label: "YouTube",
		icon: AiOutlineYoutube,
	},
	{
		key: "instagram",
		label: "Instagram",
		icon: FaInstagram,
	},
	{
		key: "tiktok",
		label: "TikTok",
		icon: FaTiktok,
	},
	{
		key: "twitter",
		label: "Twitter",
		icon: FaXTwitter,
	},
	{
		key: "soundcloud",
		label: "SoundCloud",
		icon: RiSoundcloudFill,
	},
];

export const ProfileMusicianInfos = ({ profile }: { profile: Profile }) => {
	// Filtrer les liens sociaux qui ont une URL
	const activeSocialLinks = SOCIAL_PLATFORMS.filter(
		(platform) =>
			profile?.socialLinks?.[platform.key as keyof typeof profile.socialLinks]
	);

	const description = profile?.description || "";

	return (
		<div className="flex flex-col gap-y-4">
			<div className="border rounded-xl flex flex-col">
				<div className="px-4 pb-6 py-2">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-extrabold">Infos</h2>
						<Link
							href={`/${profile?.username}/edit/profile/info`}
							onClick={saveLastFocusedElement}
							className="relative group flex justify-center items-center rounded-full w-12 h-12 hover:bg-hover"
						>
							<Pencil
								style={{ width: "1.3em", height: "1.3em" }}
								className="text-foreground/80 group-hover:text-foreground"
							/>
						</Link>
					</div>
					<CollapsibleText
						text={description}
						maxLines={5}
						className="opacity-90"
						alignButton="right"
					/>
					<div className="mt-4 flex justify-center flex-col gap-y-2">
						<div className="flex gap-x-2">
							<span className="font-extrabold">Membre depuis : </span>
							<span>
								{profile?.createdAt
									? formatDateToMonthYear(profile.createdAt)
									: "Non disponible"}
							</span>
						</div>
						<div className="flex gap-x-2">
							<span className="font-extrabold">Concerts joués : </span>
							<span>
								{profile?.concertsPlayed === "NOT_SPECIFIED" && "Non spécifié"}
								{profile?.concertsPlayed === "LESS_THAN_10" && "Moins de 10"}
								{profile?.concertsPlayed === "TEN_TO_FIFTY" && "10 à 50"}
								{profile?.concertsPlayed === "FIFTY_TO_HUNDRED" && "50 à 100"}
								{profile?.concertsPlayed === "MORE_THAN_HUNDRED" && "100+"}
							</span>
						</div>
						<div className="flex gap-x-2">
							<span className="font-extrabold">Répète souvent : </span>
							<span>
								{profile?.rehearsalsPerWeek === "NOT_SPECIFIED" &&
									"Non spécifié"}
								{profile?.rehearsalsPerWeek === "ONCE_PER_WEEK" &&
									"1 fois par semaine"}
								{profile?.rehearsalsPerWeek === "TWO_TO_THREE_PER_WEEK" &&
									"2-3 fois par semaine"}
								{profile?.rehearsalsPerWeek === "MORE_THAN_THREE_PER_WEEK" &&
									"Plus de 3 fois par semaine"}
							</span>
						</div>
						<div className="flex gap-x-2">
							<span className="font-extrabold">Type de pratique : </span>
							<span>
								{profile?.practiceType === "NOT_SPECIFIED" && "Non spécifié"}
								{profile?.practiceType === "HOBBY" && "Loisir"}
								{profile?.practiceType === "ACTIVE" && "En activité"}
							</span>
						</div>
					</div>
					{activeSocialLinks.length > 0 && (
						<div className="mt-8 flex flex-col gap-y-2">
							<div className="">
								<div className="flex gap-x-2 flex-wrap">
									{activeSocialLinks.map((platform) => {
										const PlatformIcon = platform.icon;
										const url =
											profile.socialLinks[
												platform.key as keyof typeof profile.socialLinks
											];

										return (
											<Link
												key={platform.key}
												href={url || "#"}
												target="_blank"
												rel="noopener noreferrer"
												className={cn(
													buttonVariants({ variant: "outline", size: "sm" }),
													"flex items-center gap-2 rounded-full text-sm"
												)}
											>
												<PlatformIcon className="text-lg" />
												<span className="font-extrabold">{platform.label}</span>
											</Link>
										);
									})}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
