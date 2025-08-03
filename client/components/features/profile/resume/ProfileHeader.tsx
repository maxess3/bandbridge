import { RiVerifiedBadgeFill } from "react-icons/ri";
import { ProfileTopActions } from "@/components/features/profile/resume/ProfileTopActions";

export const ProfileHeader = ({
	firstName,
	lastName,
	username,
	isOwner,
}: {
	firstName?: string;
	lastName?: string;
	username?: string;
	isOwner: boolean;
}) => {
	return (
		<div className="flex flex-wrap justify-between items-start gap-3">
			<div>
				<div className="text-2xl font-semibold">
					<span className="inline-flex items-center gap-x-1 flex-wrap">
						{firstName} {lastName}
						<RiVerifiedBadgeFill className="size-6" color="#4476ff" />
					</span>
				</div>
				<div className="w-fit text-base font-medium opacity-80">
					<span>@</span>
					{username}
				</div>
			</div>
			{/* Actions Buttons Profile (Follow, Message, etc.) */}
			{!isOwner && username && <ProfileTopActions username={username} />}
		</div>
	);
};
