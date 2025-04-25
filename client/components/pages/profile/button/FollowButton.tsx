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
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: [...PROFILE_QUERY_KEY, profile?.username],
			});

			const previousProfile = queryClient.getQueryData([
				...PROFILE_QUERY_KEY,
				profile?.username,
			]) as Profile | undefined;

			queryClient.setQueryData(["isFollowing", profile?.username], {
				isFollowing: !followData?.isFollowing,
			});

			if (previousProfile) {
				queryClient.setQueryData([...PROFILE_QUERY_KEY, profile?.username], {
					...previousProfile,
					followers:
						previousProfile.followers + (followData?.isFollowing ? -1 : 1),
				});
			}

			return { previousProfile };
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(
				[...PROFILE_QUERY_KEY, profile?.username],
				context?.previousProfile
			);
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
			variant={followData?.isFollowing ? "secondary" : "default"}
			className="rounded-md text-base"
		>
			{followData?.isFollowing ? "Abonné(e)" : "Suivre"}
		</Button>
	);
};
