import { Button } from "@/components/ui/button";
import { UserCheckIcon, UserPlusIcon } from "@phosphor-icons/react";

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
      className={`w-28 h-11 text-base ${
        isFollowing ? "" : "bg-foreground text-background"
      }`}
      onClick={onToggleFollow}
      disabled={isPending}
    >
      {isFollowing ? (
        <>
          <UserCheckIcon className="size-5!" weight="bold" /> Suivi
        </>
      ) : (
        <>
          <UserPlusIcon className="size-5!" weight="bold" /> Suivre
        </>
      )}
    </Button>
  );
};
