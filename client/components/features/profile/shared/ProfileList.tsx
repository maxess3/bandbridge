"use client";

import { useEffect, useRef, useCallback } from "react";
import { ProfileCard } from "./ProfileCard";
import { LoadingSpinner } from "@/components/shared/loader/LoadingSpinner";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ProfileListProps {
	username: string;
	type: "followers" | "following";
	title: string;
	emptyMessage: string;
	variant: "follower" | "following";
}

export const ProfileList = ({
	username,
	type,
	title,
	emptyMessage,
	variant,
}: ProfileListProps) => {
	// Query infinie pour la pagination
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
		refetch,
	} = useInfiniteQuery({
		queryKey: ["profile-list", username, type],
		queryFn: async ({ pageParam }) => {
			const endpoint = `/profile/${username}/${type}`;
			const searchParams = new URLSearchParams();
			searchParams.set("limit", "50");
			if (pageParam) {
				searchParams.set("cursor", pageParam);
			}

			// Utiliser fetch directement car useInfiniteQuery ne supporte pas useAxiosAuth
			const response = await fetch(
				`${
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
				}${endpoint}?${searchParams}`
			);

			if (!response.ok) {
				throw new Error(`Impossible de récupérer les ${type}`);
			}

			return response.json();
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
		enabled: !!username,
	});

	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);

	// Infinite scroll avec Intersection Observer
	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage();
			}
		},
		[hasNextPage, isFetchingNextPage, fetchNextPage]
	);

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		observerRef.current = new IntersectionObserver(handleObserver, {
			threshold: 0.1,
			rootMargin: "100px",
		});

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current);
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [handleObserver]);

	// Extraire tous les profils de toutes les pages
	const allProfiles = data?.pages.flatMap((page) => page[type] || []) || [];

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<LoadingSpinner />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500 mb-4">
					{error instanceof Error ? error.message : "Une erreur est survenue"}
				</p>
				<button
					onClick={() => refetch()}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Réessayer
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
			<h2 className="text-2xl font-bold mb-6">
				{title} ({allProfiles.length})
			</h2>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{allProfiles.map((profile) => (
					<ProfileCard key={profile.id} profile={profile} variant={variant} />
				))}
			</div>

			{/* Élément de déclenchement pour l'infinite scroll */}
			{hasNextPage && (
				<div ref={loadMoreRef} className="py-4 text-center">
					{isFetchingNextPage ? (
						<div className="flex items-center justify-center gap-2">
							<LoadingSpinner />
							<span className="text-gray-600">
								Chargement de plus de profils...
							</span>
						</div>
					) : (
						<div className="h-4" />
					)}
				</div>
			)}

			{/* Message de fin */}
			{!hasNextPage && allProfiles.length > 0 && (
				<div className="text-center py-4">
					<p className="text-gray-500 text-sm">
						Tous les profils ont été chargés
					</p>
				</div>
			)}
		</div>
	);
};
