import { RiVerifiedBadgeFill } from "react-icons/ri";
import { ProfileInstruments } from "@/components/features/profile/resume/ProfileInstruments";
import { ProfileMusicGenres } from "@/components/features/profile/resume/ProfileMusicGenres";
import { ProfileTopActions } from "@/components/features/profile/resume/ProfileTopActions";

export const ProfileHeader = ({
	firstName,
	lastName,
	username,
	isOwner,
	instruments,
	genres,
}: {
	firstName?: string;
	lastName?: string;
	username?: string;
	isOwner: boolean;
	instruments?: {
		instrumentTypeId: string;
		level: string | null;
		order: number;
		instrumentType: {
			name: string;
			profession: string | null;
		};
	}[];
	genres?: string[];
}) => {
	return (
		<div className="flex flex-wrap justify-between items-start">
			<div>
				<div className="text-2xl font-semibold">
					<span className="inline-flex items-center gap-x-1 flex-wrap">
						{firstName} {lastName}
						<RiVerifiedBadgeFill className="size-6" color="#4476ff" />
					</span>
				</div>
				<div className="space-y-3">
					<ProfileInstruments instruments={instruments} />
					<ProfileMusicGenres genres={genres} />
				</div>
			</div>
			{/* Actions Buttons Profile (Follow, Message, etc.) */}
			{!isOwner && username && <ProfileTopActions username={username} />}
		</div>
	);
};
