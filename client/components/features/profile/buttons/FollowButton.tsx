import { Button } from "@/components/ui/button";

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
      variant="outline"
      className="w-28 h-11 text-base"
      onClick={onToggleFollow}
      disabled={isPending}
    >
      {isFollowing ? "Suivi" : "Follow"}
    </Button>
  );
};
