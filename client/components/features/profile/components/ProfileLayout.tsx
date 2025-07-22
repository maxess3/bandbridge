import { ProfilePicture } from "@/components/features/profile/resume/ProfilePicture";
import { EditProfileButton } from "@/components/features/profile/buttons/EditProfileButton";
import { ProfileHeader } from "@/components/features/profile/resume/ProfileHeader";
import { ProfileStatLinks } from "@/components/features/profile/resume/ProfileStatLinks";
import { ProfileBasicInfo } from "@/components/features/profile/resume/ProfileBasicInfo";
// import { ProfileMusicInterests } from "@/components/features/profile/components/ProfileMusicInterests";
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
    <div className="flex gap-3 p-3 w-full h-fit">
      <div className="w-2/3 flex flex-col">
        <div className="bg-[#111111] rounded-xl w-full border">
          <div className="w-full h-48 bg-gradient-to-r from-violet-600 to-indigo-600 relative rounded-t-xl">
            <ProfilePicture
              isOwner={isOwner}
              src={profile?.profilePictureKey}
              alt="Photo de profil"
            />
          </div>
          <div className="flex w-full gap-x-6 p-6 relative">
            <div className="flex flex-col w-full space-y-9">
              <div className="flex justify-end">
                <EditProfileButton
                  isOwner={isOwner}
                  url={`/${profile?.username}/edit/profile/general`}
                />
              </div>
              <div className="space-y-6">
                <ProfileHeader isOwner={isOwner} profile={profile} />
                <ProfileStatLinks
                  followers={profile?.followers}
                  following={profile?.following}
                />
                <div className="space-y-2">
                  <ProfileBasicInfo profile={profile} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <ProfileMusicInterests /> */}
      </div>
      <ProfileAside profile={profile} isOwner={isOwner} />
    </div>
  );
}
