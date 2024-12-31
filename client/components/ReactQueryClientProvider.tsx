"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	QueryClient,
	QueryClientProvider,
	MutationCache,
	QueryCache,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			if (error instanceof AxiosError) {
				switch (error.code) {
					case "ERR_BAD_REQUEST":
						if (error.status === 429) {
							toast.error(`Trop de requêtes, veuillez réessayer plus tard.`);
						}
						break;
					case "ERR_NETWORK":
						toast.error(`Erreur réseau`);
					default:
						break;
				}
			}
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			// cache-level mutations error handler
			if (error instanceof AxiosError) {
				switch (error.code) {
					case "ERR_BAD_REQUEST":
						if (error.status === 429) {
							toast.error(`Trop de requêtes, veuillez réessayer dans 5 min`);
						}
						break;
					case "ERR_NETWORK":
						toast.error(`Erreur réseau`);
					default:
						break;
				}
			}
		},
	}),
});

export const ReactQueryClientProvider = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};
