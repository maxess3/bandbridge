import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SlPencil } from "react-icons/sl";
import { useProfileContext } from "@/context/ProfileContext";

export const ProfileHeader = () => {
  const { isPublic, profile } = useProfileContext();

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <span className="text-3xl font-bold inline-flex items-center">
          {profile?.firstName}
        </span>
        <span className="text-base relative -top-0.5">
          @{profile?.username}
        </span>
      </div>
      {isPublic ? (
        ""
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
