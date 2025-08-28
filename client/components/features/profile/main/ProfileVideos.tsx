import { EditProfileButton } from "@/components/features/profile/buttons/EditProfileButton";
import { Profile } from "@/types/Profile";

export const ProfileVideos = ({
	isOwner,
	profile,
}: {
	isOwner: boolean;
	profile: Profile;
}) => {
	return (
		<div className="flex flex-col border py-6 px-6 rounded-2xl h-fit relative">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-medium">Vidéos</h2>
				<EditProfileButton
					isOwner={isOwner}
					url={`/${profile?.username}/edit/profile/info`}
				/>
			</div>
			<div className="flex flex-col gap-2"></div>
		</div>
	);
};
