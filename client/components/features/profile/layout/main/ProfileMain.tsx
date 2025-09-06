import { Profile } from "@/types/Profile";
import { ProfileVideos } from "@/components/features/profile/layout/main/ProfileVideos";

export const ProfileMain = ({
  isOwner,
  profile,
}: {
  isOwner: boolean;
  profile: Profile;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <ProfileVideos profile={profile} isOwner={isOwner} />
    </div>
  );
};
