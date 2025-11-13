import { Button } from "@/components/ui/button";
import { FaUserCheck } from "react-icons/fa";
import { LucideUserRoundPlus } from "lucide-react";

interface FollowButtonProps {
  isFollowing: boolean;
  onToggleFollow: () => void;
  isPending: boolean;
}

export const FollowButton = ({
  isFollowing,
  onToggleFollow,
  isPending,
}: FollowButtonProps) => {
  return (
    <Button
      className="w-28"
      onClick={onToggleFollow}
      disabled={isPending}
      icon={
        isFollowing ? (
          <FaUserCheck className="size-5!" />
        ) : (
          <LucideUserRoundPlus className="size-5!" />
        )
      }
      variant={isFollowing ? "outline" : "default"}
    >
      {isFollowing ? "Suivi" : "Follow"}
    </Button>
  );
};
