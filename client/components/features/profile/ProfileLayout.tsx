import { Profile } from "@/types/Profile";
import { ProfilePicture } from "@/components/features/profile/resume/ProfilePicture";
import { ProfileInstruments } from "@/components/features/profile/resume/ProfileInstruments";
import { ProfileMusicGenres } from "@/components/features/profile/resume/ProfileMusicGenres";
import { IoLocationOutline } from "react-icons/io5";
import { FiShare, FiUser, FiUserPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FiMessageSquare } from "react-icons/fi";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { CollapsibleText } from "@/components/shared/buttons/CollapsibleText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileLayoutProps {
  isOwner?: boolean;
  profile: Profile;
}

export function ProfileLayout({
  isOwner = false,
  profile,
}: ProfileLayoutProps) {
  return (
    <main className="w-full flex flex-col gap-12 px-6 py-12">
      <div className="flex gap-6">
        <div>
          <ProfilePicture
            isOwner={isOwner}
            src={profile?.profilePictureKey}
            alt="Photo de profil"
          />
        </div>
        <div className="flex flex-col justify-between gap-6 w-3/4">
          <div className="flex flex-col">
            <div className="text-4xl font-medium inline-flex items-center gap-2">
              {profile?.pseudonyme}
              <AiFillSafetyCertificate className="!size-7 text-blue-500" />
            </div>
            <div className="text-lg font-medium opacity-80">
              @{profile?.username}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="rounded-md w-fit">
              <ProfileInstruments instruments={profile?.instruments} />
            </div>
            <div className="flex flex-col  w-fit py-1">
              <ProfileMusicGenres genres={profile?.genres} />
            </div>
          </div>
          <div className="flex flex-col font-medium text-base space-y-2">
            <span className="flex items-center gap-2 opacity-80">
              <FiUser className="!size-5" />
              Musicien{profile?.age ? `, ${profile?.age} ans` : ""}
            </span>
            <span className="flex items-center gap-2 opacity-80">
              <IoLocationOutline className="!size-5" />
              {profile?.city
                ? `${profile?.city}, ${profile?.zipCode} ${profile?.country}`
                : ""}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="default" className="rounded-full">
              <FiUserPlus className="!size-5" />
              Follow
            </Button>
            <Button variant="outline" className="rounded-full">
              <FiMessageSquare className="!size-4" />
              Message
            </Button>
            <Button variant="outline" className="rounded-full">
              <FiShare className="!size-4" />
              Partager
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-3/4 flex flex-col gap-2">
          <div className="flex flex-col border py-6 px-6 rounded-2xl h-fit">
            <div className="flex flex-col gap-4">
              <div className="text-2xl font-medium">Vidéos</div>
              <div className="h-80 w-full bg-slate-100 rounded-lg"></div>
            </div>
            <div className="flex flex-col gap-2"></div>
          </div>
          <div className="flex flex-col border py-6 px-6 rounded-2xl h-fit">
            <div className="flex flex-col gap-4">
              <div className="text-2xl font-medium">Infos</div>
              <CollapsibleText
                className="text-base opacity-90"
                text={profile?.description}
                maxLines={4}
              />
            </div>
            <div className="flex flex-col gap-2"></div>
          </div>
        </div>

        <div className="w-1/4 rounded-2xl h-fit flex flex-col justify-between min-w-[350px] border p-6 gap-6">
          <div className="flex">
            <div className="flex flex-col gap-2 w-1/3">
              <span className="text-base font-medium opacity-90">Abonnés</span>
              <span className="text-3xl font-semibold">
                {profile?.followers}
              </span>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <span className="text-base font-medium opacity-90">Suivis</span>
              <span className="text-3xl font-semibold">
                {profile?.following}
              </span>
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <span className="text-base font-medium opacity-90">Groupes</span>
              <span className="text-3xl font-semibold">0</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium">Profil similaires</h3>
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={profile?.profilePictureKey} />
                  <AvatarFallback>
                    {profile?.pseudonyme.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">
                  {profile?.pseudonyme}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={profile?.profilePictureKey} />
                  <AvatarFallback>
                    {profile?.pseudonyme.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">
                  {profile?.pseudonyme}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={profile?.profilePictureKey} />
                  <AvatarFallback>
                    {profile?.pseudonyme.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">
                  {profile?.pseudonyme}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
