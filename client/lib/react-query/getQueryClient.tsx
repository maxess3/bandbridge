import {
	QueryClient,
	MutationCache,
	QueryCache,
	isServer,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";

interface ApiError extends Error {
	response?: {
		data: {
			message?: string;
		};
	};
}

interface ApiResponse {
	message?: string;
}

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
		queryCache: new QueryCache({
			onSuccess: (data: unknown) => {
				if ((data as ApiResponse)?.message) {
					toast.success((data as ApiResponse).message, {
						action: {
							label: (
								<div className="w-9 h-9 hover:bg-secondary rounded-full flex items-center justify-center">
									<IoMdClose className="text-xl" />
								</div>
							),
							onClick: () => {},
						},
					});
				}
			},
			onError: (error: ApiError) => {
				if (error.response?.data.message) {
					toast.error(error.response?.data.message, {
						action: {
							label: (
								<div className="w-9 h-9 hover:bg-secondary rounded-full flex items-center justify-center">
									<IoMdClose className="text-xl" />
								</div>
							),
							onClick: () => {},
						},
					});
				}
			},
		}),
		mutationCache: new MutationCache({
			onSuccess: (data: unknown, _variables, _context, mutation) => {
				if (mutation.options.meta?.skipToast) {
					return;
				}
				if ((data as ApiResponse)?.message) {
					toast.success((data as ApiResponse).message, {
						action: {
							label: (
								<div className="w-9 h-9 hover:bg-secondary rounded-full flex items-center justify-center">
									<IoMdClose className="text-xl" />
								</div>
							),
							onClick: () => {},
						},
					});
				}
			},
			onError: (error: ApiError) => {
				if (error.response?.data.message) {
					toast.error(error.response?.data.message, {
						action: {
							label: (
								<div className="w-9 h-9 hover:bg-secondary rounded-full flex items-center justify-center">
									<IoMdClose className="text-xl" />
								</div>
							),
							onClick: () => {},
						},
					});
				}
			},
		}),
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) {
			browserQueryClient = makeQueryClient();
		}
		return browserQueryClient;
	}
}
