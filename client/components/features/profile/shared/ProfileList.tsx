"use client";

import { ProfileCard } from "./ProfileCard";
import { useProfileList } from "@/hooks/useProfileList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useMemo } from "react";

// Type pour les profils retournés par l'API
type ApiProfile = {
	id: string;
	pseudonyme: string;
	profilePictureKey?: string;
	lastActiveAt?: string;
	user: {
		username: string;
		firstName: string;
		lastName: string;
	};
};

interface ProfileListProps {
	username: string;
	type: "followers" | "following";
	emptyMessage: string;
	variant: "follower" | "following";
}

const MESSAGES = {
	loading: "Chargement de plus de profils...",
	allLoaded: "Tous les profils ont été chargés",
	error: "Une erreur est survenue",
	retry: "Réessayer",
} as const;

const SkeletonProfileCard = () => (
	<div className="animate-pulse bg-white rounded-lg p-4 shadow">
		<div className="flex items-center space-x-4">
			<div className="w-12 h-12 bg-gray-200 rounded-full"></div>
			<div className="flex-1 space-y-2">
				<div className="h-4 bg-gray-200 rounded w-3/4"></div>
				<div className="h-3 bg-gray-200 rounded w-1/2"></div>
			</div>
		</div>
	</div>
);

export const ProfileList = ({
	username,
	type,
	emptyMessage,
	variant,
}: ProfileListProps) => {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
		refetch,
	} = useProfileList(username, type);

	const { loadMoreRef } = useInfiniteScroll(
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	);

	const allProfiles = useMemo(
		() =>
			(data?.pages.flatMap((page) => page[type] || []) || []) as ApiProfile[],
		[data, type]
	);

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<SkeletonProfileCard key={i} />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500 mb-4">
					{error instanceof Error ? error.message : MESSAGES.error}
				</p>
				<button
					onClick={() => refetch()}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					aria-label="Réessayer de charger les profils"
				>
					{MESSAGES.retry}
				</button>
			</div>
		);
	}

	if (allProfiles.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500 text-lg">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{allProfiles.map((profile, index) => (
					<ProfileCard
						key={profile.id || `profile-${index}`}
						profile={profile}
						variant={variant}
					/>
				))}
			</div>

			{/* Infinite scroll */}
			{hasNextPage && (
				<div ref={loadMoreRef} className="py-4 text-center">
					{isFetchingNextPage ? (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{[...Array(6)].map((_, i) => (
								<SkeletonProfileCard key={i} />
							))}
						</div>
					) : (
						<div className="h-4" />
					)}
				</div>
			)}

			{/* End of infinite scroll */}
			{!hasNextPage && allProfiles.length > 0 && (
				<div className="text-center py-4">
					<p className="text-gray-500 text-sm">{MESSAGES.allLoaded}</p>
				</div>
			)}
		</div>
	);
};
