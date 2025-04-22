import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { Profile } from "@/types/Profile";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { FaUserCheck } from "react-icons/fa";
import { LucideUserRoundPlus } from "lucide-react";

export const FollowButton = ({ profile }: { profile: Profile }) => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	const {
		data: followData,
		refetch: refetchFollowStatus,
		isLoading,
	} = useQuery({
		queryKey: ["isFollowing", profile?.username],
		queryFn: async () => {
			const { data } = await axiosAuth.get(
				`/profile/following/${profile?.username}`
			);
			return data;
		},
		enabled: !!profile?.username,
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

	if (isLoading) {
		return null;
	}

	return (
		<Button
			onClick={() => toggleFollow()}
			disabled={isPending}
			icon={
				followData?.isFollowing ? (
					<FaUserCheck style={{ width: "1.1em", height: "1.1em" }} />
				) : (
					<LucideUserRoundPlus style={{ width: "1.1em", height: "1.1em" }} />
				)
			}
			variant={followData?.isFollowing ? "secondary" : "primary"}
			className="rounded-md text-base"
		>
			{followData?.isFollowing ? "Abonné(e)" : "Suivre"}
		</Button>
	);
};
