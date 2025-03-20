import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SlPencil } from "react-icons/sl";

export const ProfileHeader = ({
  firstname,
  username,
}: {
  firstname: string;
  username: string;
}) => (
  <div className="flex justify-between">
    <div className="flex flex-col">
      <span className="text-2xl font-semibold inline-flex items-center">
        {firstname}
      </span>
      <span className="text-base relative -top-0.5">{username}</span>
    </div>
    <Link href="/me/edit/profile/general">
      <Button variant="outline" icon={<SlPencil />}>
        Modifier mon profil
      </Button>
    </Link>
  </div>
);
