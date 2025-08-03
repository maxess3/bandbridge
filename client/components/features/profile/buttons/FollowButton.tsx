import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { PROFILE_QUERY_KEY } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { FaUserCheck } from "react-icons/fa";
import { LucideUserRoundPlus } from "lucide-react";

export const FollowButton = ({ username }: { username: string }) => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	const {
		data: followData,
		refetch: refetchFollowStatus,
		isLoading,
	} = useQuery({
		queryKey: ["isFollowing", username],
		queryFn: async () => {
			const { data } = await axiosAuth.get(`/profile/following/${username}`);
			return data;
		},
		enabled: !!username,
	});

	const { mutate: toggleFollow, isPending } = useMutation({
		mutationFn: async () => {
			const endpoint = followData?.isFollowing ? "unfollow" : "follow";
			await axiosAuth.post(`/profile/${endpoint}/${username}`);
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
			icon={followData?.isFollowing ? <FaUserCheck /> : <LucideUserRoundPlus />}
			variant={followData?.isFollowing ? "outline" : "default"}
		>
			{followData?.isFollowing ? "Abonné(e)" : "Suivre"}
		</Button>
	);
};
