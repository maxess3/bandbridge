import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SlPencil } from "react-icons/sl";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useProfileContext } from "@/context/ProfileContext";

export const ProfileHeader = () => {
  const { isPublic, profile } = useProfileContext();

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <span className="text-3xl gap-x-1.5 font-bold inline-flex items-center">
          {profile?.firstName}
          <RiVerifiedBadgeFill size={"0.9em"} />
        </span>
        <span className="text-lg font-medium opacity-80">
          @{profile?.username}
        </span>
      </div>
      {isPublic ? (
        <Link href="/me/edit/profile/general">
          <Button className="bg-foreground text-background font-semibold">
            Suivre
          </Button>
        </Link>
      ) : (
        <Link href="/me/edit/profile/general">
          <Button variant="outline" icon={<SlPencil />}>
            Modifier mon profil
          </Button>
        </Link>
      )}
    </div>
  );
};
