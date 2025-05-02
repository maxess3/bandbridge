"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import ProfileSmall from "@/public/profile_small.png";
import { Avatar } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	HoverCard,
	HoverCardTrigger,
	HoverCardContent,
} from "@/components/ui/hover-card";
import { ProfileSocialLink } from "@/components/pages/profile/sidebar/ProfileSocialLink";
import { FiPlusCircle } from "react-icons/fi";
import { Profile } from "@/types/Profile";
import { saveLastFocusedElement } from "@/utils/utils";

type SocialPlatform =
	| "youtube"
	| "instagram"
	| "tiktok"
	| "twitter"
	| "soundcloud";

type SocialLinks = Partial<Record<SocialPlatform, string>>;

interface SocialLinksProps {
	socialLinks: SocialLinks;
	username: string;
	isOwner: boolean;
}

interface ListItem {
	name: string;
	tag: string;
	subtitle: string;
}

const ListItemWithAvatar = ({
	name,
	tag,
	subtitle,
}: {
	name: string;
	tag: string;
	subtitle: string;
}) => (
	<li className="flex items-center space-x-2 border-b pb-3 last:border-b-0 border-border-extralight last:pb-0">
		<Avatar className="w-11 h-11">
			<div className="relative w-full h-full">
				<Image
					src={ProfileSmall}
					alt={name}
					fill
					className="rounded-full object-cover"
					sizes="44px"
					priority
				/>
			</div>
		</Avatar>
		<div className="flex flex-col">
			<span className="font-semibold text-base">
				{name}
				<Badge variant="outline" className="ml-1">
					{tag}
				</Badge>
			</span>
			<span>{subtitle}</span>
		</div>
	</li>
);

const ListSection = ({
	title,
	items,
	buttonText,
}: {
	title: string;
	items: ListItem[];
	buttonText: string;
}) => (
	<div className="border border-border-light rounded-xl">
		<div className="p-4 space-y-3">
			<span className="font-bold text-sm uppercase">{title}</span>
			<ul className="space-y-3 text-sm">
				{items.map((item: ListItem, index: number) => (
					<ListItemWithAvatar key={index} {...item} />
				))}
			</ul>
		</div>
		<div className="flex items-center justify-center w-full border-t border-border-light">
			<Button
				variant="ghost"
				className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
			>
				{buttonText}
			</Button>
		</div>
	</div>
);

const SocialLinks = ({ socialLinks, username, isOwner }: SocialLinksProps) => {
	const platforms: SocialPlatform[] = [
		"youtube",
		"instagram",
		"tiktok",
		"twitter",
		"soundcloud",
	];

	return (
		<div className="space-y-3 p-4 border border-border-light rounded-xl">
			<span className="uppercase text-sm font-bold">Liens</span>
			<div className="space-y-4">
				<ul className="text-sm flex items-center flex-wrap gap-2">
					{platforms.map(
						(platform) =>
							socialLinks?.[platform] && (
								<ProfileSocialLink
									key={platform}
									platform={platform}
									url={socialLinks[platform]}
								/>
							)
					)}
				</ul>
				{isOwner && (
					<Link
						href={`/${username}/edit/profile/social`}
						onClick={saveLastFocusedElement}
						className={
							buttonVariants({ variant: "secondary", size: "xs" }) +
							" rounded-md text-sm"
						}
					>
						<FiPlusCircle style={{ height: 16, width: 16 }} />
						Ajouter un lien
					</Link>
				)}
			</div>
		</div>
	);
};

export const ProfileSidebar = ({
	profile,
	isOwner,
}: {
	profile: Profile;
	isOwner: boolean;
}) => {
	const { data: session } = useSession();

	const nearbyGroups = [
		{ name: "Groupe 1", tag: "Rock", subtitle: "Recherche des musiciens" },
		{ name: "Groupe 2", tag: "Rap", subtitle: "Recherche des musiciens" },
		{ name: "Groupe 3", tag: "Rap", subtitle: "Recherche des musiciens" },
		{ name: "Groupe 4", tag: "Rap", subtitle: "Recherche des musiciens" },
	];

	const nearbyMusicians = [
		{ name: "Musicien 1", tag: "Guitare", subtitle: "Recherche un groupe" },
		{ name: "Musicien 2", tag: "Chant", subtitle: "Recherche un groupe" },
		{ name: "Musicien 3", tag: "Chant", subtitle: "Recherche un groupe" },
		{ name: "Musicien 4", tag: "Chant", subtitle: "Recherche un groupe" },
	];

	return (
		<div className="w-[300px] rounded-xl">
			<div className="space-y-3">
				{(!isOwner
					? profile?.socialLinks && Object.keys(profile?.socialLinks).length > 0
					: true) && (
					<SocialLinks
						socialLinks={profile?.socialLinks}
						username={profile?.username}
						isOwner={isOwner}
					/>
				)}
				{profile?.lastFollowers.length && !isOwner ? (
					<div className="space-y-4 border border-border-light rounded-xl">
						<div className="">
							<span className="uppercase text-sm font-bold p-4 inline-flex w-full">
								{profile?.followers} Abonnés
							</span>
							<div className="w-full">
								<ul className="flex items-center w-full px-4">
									{profile?.lastFollowers?.map((follower) => (
										<li key={follower.username} className="-mr-2">
											<HoverCard>
												<HoverCardTrigger asChild>
													<Link href={`/${follower.username}`}>
														<Image
															src={ProfileSmall}
															alt="Follower"
															className="rounded-full border-2 border-background"
															sizes="48px"
															priority
														/>
													</Link>
												</HoverCardTrigger>
												<HoverCardContent className="space-y-2">
													<div className="flex items-center justify-between">
														<div className="h-16 w-16 rounded-full relative bg-secondary">
															<Link href={`/${follower.username}`}>
																<Image
																	src={ProfileSmall}
																	alt="Follower"
																	fill
																	className="rounded-full"
																/>
															</Link>
														</div>
														{follower?.username !== session?.user?.username &&
															session?.user && (
																<div>
																	<Button
																		variant="default"
																		size="sm"
																		className="text-base"
																	>
																		Suivre
																	</Button>
																</div>
															)}
													</div>
													<div>
														<span className="text-lg font-semibold font-satoshi">
															<Link
																href={`/${follower.username}`}
																className="hover:underline"
															>
																{follower.firstName}
															</Link>
														</span>
														<span className="text-sm flex items-center gap-x-1 opacity-80 font-semibold">
															@{follower.username}
														</span>
													</div>
												</HoverCardContent>
											</HoverCard>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="flex items-center justify-center w-full border-t border-border-light">
							<Button
								variant="ghost"
								className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
							>
								Tout afficher
							</Button>
						</div>
					</div>
				) : (
					""
				)}
				<ListSection
					title="Groupes à proximité"
					items={nearbyGroups}
					buttonText="Tout afficher"
				/>
				<ListSection
					title="Musiciens à proximité"
					items={nearbyMusicians}
					buttonText="Tout afficher"
				/>
			</div>
		</div>
	);
};
