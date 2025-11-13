import { EditSectionButton } from "@/components/features/profile/buttons/EditSectionButton";
import { Profile } from "@/types/Profile";

export const ProfileVideos = ({
  isOwner,
  profile,
}: {
  isOwner: boolean;
  profile: Profile;
}) => {
  return (
    <div className="flex flex-col border py-6 px-6 rounded-lg h-fit relative">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Vidéos</h2>
        <EditSectionButton
          isOwner={isOwner}
          url={`/${profile?.username}/edit/profile/general`}
        />
      </div>
      <div className="flex flex-col gap-2"></div>
    </div>
  );
};
