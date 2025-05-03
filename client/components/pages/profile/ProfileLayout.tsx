import { ProfilePicture } from "@/components/pages/profile/header/ProfilePicture";
import { ProfileTop } from "@/components/pages/profile/header/ProfileTop";
import { ProfileStats } from "@/components/pages/profile/header/ProfileSocialStats";
import { ProfileUserInfo } from "@/components/pages/profile/header/ProfileUserInfo";
import { ProfileMusicInterests } from "@/components/pages/profile/header/ProfileMusicInterests";
import { ProfileSidebar } from "@/components/pages/profile/sidebar/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/Profile";
interface ProfileLayoutProps {
	isOwner?: boolean;
	profile: Profile;
}

export function ProfileLayout({
	isOwner = false,
	profile,
}: ProfileLayoutProps) {
	return (
		<div className="py-8 flex flex-col w-full">
			<div className="w-full flex gap-x-8">
				<div className="w-[800px] space-y-8">
					<div className="flex w-full gap-x-6">
						<div className="flex items-center">
							<ProfilePicture
								isOwner={isOwner}
								src="/profile_large.jpeg"
								alt="Photo de profil"
							/>
						</div>
						<div className="flex flex-col w-full space-y-6">
							<ProfileTop isOwner={isOwner} profile={profile} />
							<ProfileStats
								followers={profile?.followers}
								following={profile?.following}
							/>
							<div className="space-y-2">
								<ProfileUserInfo profile={profile} />
								<ProfileMusicInterests />
							</div>
						</div>
					</div>
					<div className="border border-border-light rounded-xl flex flex-col">
						<div className="p-6 space-y-6">
							<div>
								<h2 className="text-xl font-semibold">
									Maxime en quelques mots...
								</h2>
							</div>
							<div className="opacity-90">
								🎸 Guitariste passionné de rock Amateur de riffs puissants et de
								solos envoûtants, je joue de la guitare depuis plus de 10 ans.
								Inspiré par des groupes comme Led Zeppelin, Foo Fighters et
								Royal Blood, je m’exprime à travers un jeu énergique et
								instinctif, à mi-chemin entre le rock classique et les sonorités
								plus modernes. Que ce soit en répétition, en studio ou sur
								scène, je cherche toujours à transmettre une émotion brute et
								authentique. Ouvert aux collaborations, je suis toujours partant
								pour créer, jammer ou monter un nouveau projet.
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
				</div>
				<ProfileSidebar profile={profile} isOwner={isOwner} />
			</div>
		</div>
	);
}
