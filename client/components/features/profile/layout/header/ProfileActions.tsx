"use client";

import { useSession } from "next-auth/react";
import { useFocusManager } from "@/contexts/FocusManagerContext";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/features/profile/buttons/FollowButton";
import { FiMessageSquare, FiShare } from "react-icons/fi";
import { Pencil } from "lucide-react";
import Link from "next/link";

export const ProfileActions = ({
  username,
  isOwner,
}: {
  username: string;
  isOwner: boolean;
}) => {
  const { data: session } = useSession();
  const { captureFocus } = useFocusManager();

  if (!session?.user) return null;

  if (isOwner) {
    return (
      <div className="flex gap-2">
        <Link
          href={`/${username}/edit/profile/general`}
          onClick={captureFocus}
          className="border font-semibold px-4 flex gap-2 justify-center items-center rounded-full hover:bg-hover"
        >
          <Pencil className="!size-4" />
          Modifier le résumé
        </Link>
        <Button variant="outline" className="rounded-full">
          <FiShare className="!size-4" />
          Partager
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <FollowButton username={username} />
      <Button variant="outline" className="rounded-full">
        <FiMessageSquare className="!size-4" />
        Message
      </Button>
      <Button variant="outline" className="rounded-full">
        <FiShare className="!size-4" />
        Partager
      </Button>
    </div>
  );
};
