import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Profile } from "@/types/Profile";
import { ProfileTopActions } from "@/components/features/profile/header/ProfileTopActions";

interface ProfileTopProps {
	profile: Profile;
	isOwner: boolean;
}

export const ProfileTop = ({ profile, isOwner }: ProfileTopProps) => {
	return (
		<div className="flex justify-between">
			<div className="flex flex-col">
				<span className="text-3xl gap-x-1.5 font-satoshi font-semibold inline-flex items-center">
					{profile?.username ? `${profile?.username}` : ""}
					<RiVerifiedBadgeFill size={"0.8em"} color="#4476ff" />
				</span>
				<span className="text-lg font-medium opacity-80">
					{" "}
					{profile?.firstName} {profile?.lastName}
				</span>
			</div>
			<ProfileTopActions profile={profile} isOwner={isOwner} />
		</div>
	);
};
