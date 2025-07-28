import { ProfilePicture } from "@/components/features/profile/resume/ProfilePicture";
import { EditProfileButton } from "@/components/features/profile/buttons/EditProfileButton";
import { ProfileHeader } from "@/components/features/profile/resume/ProfileHeader";
import { ProfileStatLinks } from "@/components/features/profile/resume/ProfileStatLinks";
import { ProfileBasicInfo } from "@/components/features/profile/resume/ProfileBasicInfo";
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
    <div className="flex md:flex-row sm:flex-col flex-col w-full h-fit lg:gap-6 md:gap-4 gap-2">
      <main className="lg:w-[calc(100%-350px)] md:w-[calc(100%-300px)]">
        <div className="bg-[#111111] rounded-xl w-full border">
          <div className="w-full lg:h-52 h-36 bg-gradient-to-r from-violet-600 to-indigo-600 relative rounded-t-xl">
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
                <div className="space-y-3">
                  <ProfileBasicInfo profile={profile} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ProfileAside profile={profile} isOwner={isOwner} />
    </div>
  );
}
