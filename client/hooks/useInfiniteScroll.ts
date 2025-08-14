import { useEffect, useRef, useCallback } from "react";

export const useInfiniteScroll = (
	hasNextPage: boolean,
	isFetchingNextPage: boolean,
	fetchNextPage: () => void
) => {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement>(null);

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

	return { loadMoreRef };
};
