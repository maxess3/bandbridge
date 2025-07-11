import { ProfilePicture } from "@/components/features/profile/header/ProfilePicture";
import { ProfileTop } from "@/components/features/profile/header/ProfileTop";
import { ProfileStats } from "@/components/features/profile/header/ProfileSocialStats";
import { ProfileUserInfo } from "@/components/features/profile/header/ProfileUserInfo";
import { ProfileMusicInterests } from "@/components/features/profile/header/ProfileMusicInterests";
import { ProfileSidebar } from "@/components/features/profile/sidebar/ProfileSidebar";
import { Button } from "@/components/ui/button";
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
                <h2 className="text-xl font-semibold">
                  Maxime en quelques mots...
                </h2>
                <Link
                  href="/profile/edit"
                  className="relative group flex justify-center items-center rounded-full w-12 h-12 hover:bg-hover"
                >
                  <Pencil
                    style={{ width: "1.35em", height: "1.35em" }}
                    className="text-foreground/80 group-hover:text-foreground"
                  />
                </Link>
              </div>
              <div className="opacity-90">
                🎸 Guitariste passionné de rock Amateur de riffs puissants et de
                solos envoûtants, je joue de la guitare depuis plus de 10 ans.
                Inspiré par des groupes comme Led Zeppelin, Foo Fighters et
                Royal Blood, je m’exprime à travers un jeu énergique et
                instinctif, à mi-chemin entre le rock classique et les sonorités
                plus modernes. Que ce soit en répétition, en studio ou sur
                scène, je cherche toujours à transmettre une émotion brute et
                authentique. Ouvert aux collaborations, je suis toujours partant
                pour créer, jammer ou monter un nouveau projet.
              </div>
            </div>
            <div className="flex items-center justify-center w-full border-t">
              <Button
                variant="ghost"
                className="font-semibold w-full h-10 rounded-t-none rounded-b-xl"
              >
                Tout afficher
              </Button>
            </div>
          </div>
        </div>
        <ProfileSidebar profile={profile} isOwner={isOwner} />
      </div>
    </div>
  );
}
