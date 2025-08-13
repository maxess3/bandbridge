// hooks/useSessionUpdate.ts
import { useSession } from "next-auth/react";
import { useSessionLoader } from "@/contexts/SessionLoaderContext";
import { useCallback, useEffect, useRef } from "react";

export function useSessionUpdate() {
	const { data: session, update } = useSession();
	const { setIgnoreLoader } = useSessionLoader();
	const previousSessionRef = useRef(session);
	const isUpdatingRef = useRef(false);

	// Observer les changements de session
	useEffect(() => {
		if (isUpdatingRef.current && session !== previousSessionRef.current) {
			// La session a été mise à jour, on peut réactiver le loader
			setIgnoreLoader(false);
			isUpdatingRef.current = false;
		}
		previousSessionRef.current = session;
	}, [session, setIgnoreLoader]);

	const updateSession = useCallback(
		async (
			updates: Partial<{
				id: string;
				email: string;
				firstName: string;
				lastName: string;
				username: string;
				pseudonyme: string;
				profilePictureKey?: string;
			}>
		) => {
			isUpdatingRef.current = true;
			setIgnoreLoader(true);

			try {
				await update({ user: updates });

				// Timeout de sécurité au cas où la session ne se mettrait pas à jour
				const timeoutId = setTimeout(() => {
					if (isUpdatingRef.current) {
						setIgnoreLoader(false);
						isUpdatingRef.current = false;
					}
				}, 1000);

				// Nettoyer le timeout si la session se met à jour avant
				const cleanup = () => {
					clearTimeout(timeoutId);
				};

				return cleanup;
			} catch (error) {
				setIgnoreLoader(false);
				isUpdatingRef.current = false;
				throw error;
			}
		},
		[update, setIgnoreLoader]
	);

	return { updateSession };
}
