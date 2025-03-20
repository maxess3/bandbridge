import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileSocialLink } from "@/components/pages/profile/ProfileSocialLink";

interface ProfileSidebarProps {
  socialLinks: {
    youtube: string;
    instagram: string;
    tiktok: string;
    twitter: string;
    soundcloud: string;
  };
}

export const ProfileSidebar = ({ socialLinks }: ProfileSidebarProps) => (
  <div className="w-3/12 bg-muted p-4 rounded-xl space-y-6">
    <div className="flex flex-col">
      <span className="font-semibold text-lg">Maxime</span>
      <span className="text-sm opacity-80">@maxess</span>
    </div>
    <div>
      <div className="text-sm space-y-3 border-t border-secondary py-3">
        <span className="text-sm">Liens</span>
        <ul className="space-y-2">
          {socialLinks?.youtube && (
            <ProfileSocialLink platform="youtube" url={socialLinks?.youtube} />
          )}
          {socialLinks?.instagram && (
            <ProfileSocialLink
              platform="instagram"
              url={socialLinks?.instagram}
            />
          )}
          {socialLinks?.tiktok && (
            <ProfileSocialLink platform="tiktok" url={socialLinks?.tiktok} />
          )}
          {socialLinks?.twitter && (
            <ProfileSocialLink platform="twitter" url={socialLinks?.twitter} />
          )}
          {socialLinks?.soundcloud && (
            <ProfileSocialLink
              platform="soundcloud"
              url={socialLinks?.soundcloud}
            />
          )}
        </ul>
        <Link href="/me/edit/profile/social" className="flex">
          <Button variant="linkForm">Ajouter un lien</Button>
        </Link>
      </div>
      <div className="text-sm space-y-3 border-t border-secondary py-3">
        <span className="text-sm">Groupe</span>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2">
            <span className="w-9 h-9 bg-muted-background rounded-sm"></span>
            <span>Les incorruptibles</span>
          </li>
        </ul>
        <Link href="/me/edit/profileBand" className="flex">
          <Button variant="linkForm">Ajouter un groupe</Button>
        </Link>
      </div>
    </div>
  </div>
);
