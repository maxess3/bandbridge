import Link from "next/link";
import { useProfileContext } from "@/context/ProfileContext";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { SlPencil } from "react-icons/sl";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { LucideUserRoundPlus, LucideUserRoundMinus } from "lucide-react";
import { useSession } from "next-auth/react";

export const ProfileHeader = () => {
  const { data: session } = useSession();
  const { isPublic, profile } = useProfileContext();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const {
    data: followData,
    refetch: refetchFollowStatus,
    isSuccess,
  } = useQuery({
    queryKey: ["isFollowing", profile?.username],
    queryFn: async () => {
      const { data } = await axiosAuth.get(
        `/profile/following/${profile?.username}`
      );
      return data;
    },
    enabled: !!session?.user && !!profile?.username && isPublic,
  });

  const { mutate: toggleFollow, isPending } = useMutation({
    mutationFn: async () => {
      const endpoint = followData?.isFollowing ? "unfollow" : "follow";
      await axiosAuth.post(`/profile/${endpoint}/${profile?.username}`);
    },
    onSuccess: () => {
      refetchFollowStatus();
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });

  const renderButton = () => {
    if (!session?.user) return null;

    if (isPublic && isSuccess) {
      return (
        <>
          <Button
            onClick={() => toggleFollow()}
            disabled={isPending}
            icon={
              followData?.isFollowing ? (
                <LucideUserRoundMinus
                  style={{ width: "1.1em", height: "1.1em" }}
                />
              ) : (
                <LucideUserRoundPlus
                  style={{ width: "1.1em", height: "1.1em" }}
                />
              )
            }
            variant={followData?.isFollowing ? "outline" : "primary"}
          >
            {followData?.isFollowing ? "Suivi(e)" : "Suivre"}
          </Button>
          <Button variant="outline">Partager</Button>
        </>
      );
    }

    return (
      <Link href={`/${session?.user.username}/edit/profile/general`}>
        <Button variant="outline" icon={<SlPencil />}>
          Modifier mon profil
        </Button>
      </Link>
    );
  };

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <span className="text-3xl gap-x-1.5 font-semibold inline-flex items-center">
          {profile?.firstName}
          <RiVerifiedBadgeFill size={"0.9em"} />
        </span>
        <span className="text-lg font-medium opacity-80">
          {profile?.username ? `@${profile?.username}` : ""}
        </span>
      </div>
      <div className="flex items-center gap-x-2">{renderButton()}</div>
    </div>
  );
};
