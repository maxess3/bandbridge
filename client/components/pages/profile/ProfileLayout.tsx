import { ProfilePicture } from "@/components/pages/profile/header/ProfilePicture";
import { ProfileTop } from "@/components/pages/profile/header/ProfileTop";
import { ProfileStats } from "@/components/pages/profile/header/ProfileSocialStats";
import { ProfileUserInfo } from "@/components/pages/profile/header/ProfileUserInfo";
import { ProfileMusicInterests } from "@/components/pages/profile/header/ProfileMusicInterests";
import { ProfileSidebar } from "@/components/pages/profile/sidebar/ProfileSidebar";
import { Button } from "@/components/ui/button";
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
    <div className="py-8 flex flex-col w-full">
      <div className="w-full flex gap-x-8">
        <div className="xl:w-9/12 space-y-8">
          <div className="flex w-full gap-x-6">
            <div className="flex items-center">
              <ProfilePicture src="/profile_large.jpeg" alt="Photo de profil" />
            </div>
            <div className="flex flex-col w-full space-y-6">
              <ProfileTop isOwner={isOwner} profile={profile} />
              <ProfileStats
                followers={profile?.followers}
                following={profile?.following}
              />
              <div className="space-y-2">
                <ProfileUserInfo profile={profile} />
                <ProfileMusicInterests />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-x-2">
            <div className="border border-border-light gap-2 rounded-xl">
              <div className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Musique</h2>
              </div>
              <div className="flex items-center justify-center w-full border-t border-border-light">
                <Button
                  variant="ghost"
                  className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
                >
                  Tout afficher
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ProfileSidebar profile={profile} isOwner={isOwner} />
      </div>
    </div>
  );
}
