import { Profile } from "@/types/Profile";
import { ProfileHeader } from "@/components/features/profile/header/ProfileHeader";
import { ProfileMain } from "@/components/features/profile/main/ProfileMain";
import { ProfileAside } from "@/components/features/profile/aside/ProfileAside";
interface ProfileLayoutProps {
	isOwner?: boolean;
	profile: Profile;
}

export function ProfileLayout({
	isOwner = false,
	profile,
}: ProfileLayoutProps) {
	return (
		<main className="w-full flex flex-col gap-12 px-6 py-12">
			<ProfileHeader profile={profile} isOwner={isOwner} />
			<div className="flex gap-6">
				<div className="w-3/4 flex flex-col gap-2">
					<ProfileMain profile={profile} isOwner={isOwner} />
				</div>
				<div className="w-1/4 rounded-2xl h-fit flex flex-col justify-between min-w-[350px] gap-6">
					<ProfileAside profile={profile} isOwner={isOwner} />
				</div>
			</div>
		</main>
	);
}
