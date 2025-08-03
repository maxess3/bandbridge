import { ProfileResumeCard } from "@/components/features/profile/resume/ProfileResumeCard";
import { ProfileAside } from "@/components/features/profile/aside/ProfileAside";
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
		<div className="w-full h-fit flex md:flex-row sm:flex-col flex-col lg:gap-6 md:gap-4 gap-2">
			<main className="lg:w-[calc(100%-350px)] md:w-[calc(100%-300px)]">
				<ProfileResumeCard profile={profile} isOwner={isOwner} />
			</main>
			<ProfileAside profile={profile} isOwner={isOwner} />
		</div>
	);
}
