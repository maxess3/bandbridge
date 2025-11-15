import { Profile } from "@/types/Profile";
import { ProfilePicture } from "@/components/features/profile/layout/header/ProfilePicture";
import { ProfileInstruments } from "@/components/features/profile/layout/header/ProfileInstruments";
import { ProfileMusicGenres } from "@/components/features/profile/layout/header/ProfileMusicGenres";
import { ProfileBasicInfo } from "@/components/features/profile/layout/header/ProfileBasicInfo";
import { ProfileActions } from "@/components/features/profile/layout/header/ProfileActions";
import { ProfileStatLinks } from "@/components/features/profile/layout/header/ProfileStatLinks";
import { AiFillSafetyCertificate } from "react-icons/ai";

export const ProfileHeader = ({
  profile,
  isOwner,
}: {
  profile: Profile;
  isOwner: boolean;
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-6">
        <ProfilePicture
          isOwner={isOwner}
          src={profile?.profilePictureKey || ""}
          alt="Photo de profil"
        />
        <div className="flex flex-col gap-6 w-3/4">
          <div className="flex flex-col">
            <div className="text-4xl font-medium inline-flex items-center gap-2">
              {profile?.pseudonyme}
              <AiFillSafetyCertificate className="size-7! text-blue-500" />
            </div>
            <div className="text-md font-normal opacity-80">
              @{profile?.username}
            </div>
          </div>
          {(profile?.instruments.length > 0 || profile?.genres.length > 0) && (
            <div className="flex flex-col space-y-1">
              <ProfileInstruments instruments={profile?.instruments} />
              <ProfileMusicGenres genres={profile?.genres} />
            </div>
          )}
          <ProfileBasicInfo
            city={profile?.city}
            zipCode={profile?.zipCode}
            age={profile?.age}
            departmentName={profile?.departmentName}
          />
          <ProfileActions
            username={profile?.username}
            pseudonyme={profile?.pseudonyme}
            isOwner={isOwner}
          />
        </div>
      </div>
      <div className="flex items-start">
        <ProfileStatLinks
          followers={profile?.followers}
          following={profile?.following}
          username={profile?.username}
        />
      </div>
    </div>
  );
};
