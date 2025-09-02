import { Profile } from "@/types/Profile";
import { ProfilePicture } from "@/components/features/profile/header/ProfilePicture";
import { ProfileInstruments } from "@/components/features/profile/header/ProfileInstruments";
import { ProfileMusicGenres } from "@/components/features/profile/header/ProfileMusicGenres";
import { ProfileBasicInfo } from "@/components/features/profile/header/ProfileBasicInfo";
import { ProfileActions } from "@/components/features/profile/header/ProfileActions";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { ProfileStatLinks } from "@/components/features/profile/header/ProfileStatLinks";

export const ProfileHeader = ({
  profile,
  isOwner,
}: {
  profile: Profile;
  isOwner: boolean;
}) => {
  return (
    <div className="flex items-start gap-6">
      <ProfilePicture
        isOwner={isOwner}
        src={profile?.profilePictureKey || ""}
        alt="Photo de profil"
      />
      <div className="flex flex-col justify-between gap-6 w-3/4">
        <div className="flex flex-col">
          <div className="text-3xl font-semibold inline-flex items-center gap-2">
            {profile?.pseudonyme}
            <AiFillSafetyCertificate className="!size-7 text-blue-500" />
          </div>
          <div className="text-lg font-medium opacity-80">
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
        <ProfileStatLinks
          followers={profile?.followers}
          following={profile?.following}
          username={profile?.username}
        />
        <ProfileActions username={profile?.username} isOwner={isOwner} />
      </div>
    </div>
  );
};
