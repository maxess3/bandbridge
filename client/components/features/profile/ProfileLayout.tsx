import { ProfilePicture } from "@/components/features/profile/header/ProfilePicture";
import { ProfileTop } from "@/components/features/profile/header/ProfileTop";
import { ProfileStats } from "@/components/features/profile/header/ProfileSocialStats";
import { ProfileUserInfo } from "@/components/features/profile/header/ProfileUserInfo";
import { ProfileMusicInterests } from "@/components/features/profile/header/ProfileMusicInterests";
import { ProfileSidebar } from "@/components/features/profile/sidebar/ProfileSidebar";
import { Pencil } from "lucide-react";
import { Profile } from "@/types/Profile";
import Link from "next/link";

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
        <div className="w-[800px] space-y-8">
          <div className="flex w-full gap-x-6">
            <div className="flex items-center">
              <ProfilePicture
                isOwner={isOwner}
                src={profile?.profilePictureKey}
                alt="Photo de profil"
              />
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
          <div className="border rounded-xl flex flex-col">
            <div className="px-6 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Infos</h2>
                <Link
                  href={`/${profile?.username}/edit/profile/info`}
                  className="relative group flex justify-center items-center rounded-full w-12 h-12 hover:bg-hover"
                >
                  <Pencil
                    style={{ width: "1.35em", height: "1.35em" }}
                    className="text-foreground/80 group-hover:text-foreground"
                  />
                </Link>
              </div>
              <div className="opacity-90">{profile?.description}</div>
            </div>
          </div>
          <div className="border rounded-xl flex flex-col">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Statut</h2>
                <Link
                  href={`/${profile?.username}/edit/profile/info`}
                  className="relative group flex justify-center items-center rounded-full w-12 h-12 hover:bg-hover"
                >
                  <Pencil
                    style={{ width: "1.35em", height: "1.35em" }}
                    className="text-foreground/80 group-hover:text-foreground"
                  />
                </Link>
              </div>
              <div className="opacity-90">{profile?.description}</div>
            </div>
          </div>
        </div>
        <ProfileSidebar profile={profile} isOwner={isOwner} />
      </div>
    </div>
  );
}
