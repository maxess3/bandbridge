import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { createDelayedFunction } from "@/helper/createDelayedFunction";
import { ProfileListItem } from "@/types/Profile";

type ProfileListResponse = {
	[type: string]: ProfileListItem[];
} & {
	nextCursor?: string;
	hasMore: boolean;
};

export const useProfileList = (
	username: string,
	type: "followers" | "following"
) => {
	const delayedQueryFn = createDelayedFunction(
		async ({ pageParam }: { pageParam: unknown }) => {
			const endpoint = `/profile/${username}/${type}`;
			const params = {
				...(pageParam ? { cursor: pageParam as string } : {}),
			};

			const response = await axios.get(endpoint, { params });
			return response.data;
		},
		400
	);

	return useInfiniteQuery({
		queryKey: ["profile-list", username, type],
		queryFn: delayedQueryFn,
		initialPageParam: undefined,
		getNextPageParam: (lastPage: ProfileListResponse) =>
			lastPage.nextCursor || undefined,
		enabled: !!username,
	});
};
