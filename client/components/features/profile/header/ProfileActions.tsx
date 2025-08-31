"use client";

import { useSession } from "next-auth/react";
import { FollowButton } from "@/components/features/profile/buttons/FollowButton";
import { Button } from "@/components/ui/button";
import { FiMessageSquare, FiShare } from "react-icons/fi";

export const ProfileActions = ({
  username,
  isOwner,
}: {
  username: string;
  isOwner: boolean;
}) => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  if (isOwner) {
    return (
      <div className="flex gap-2">
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
