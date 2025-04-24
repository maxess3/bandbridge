import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { profileServices } from "@/services/profileServices";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/react-query/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { EditProfileSocialModal } from "@/components/modal/EditProfileSocialModal";

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	// Check if the user is the owner of the profile
	const session = await getServerSession(authOptions);
	if (!session || slug !== session?.user.username) {
		notFound();
	}

	// Check if the profile exists
	const profile = await profileServices.getProfile(slug);
	if (!profile) {
		notFound();
	}

	// Prefetch the profile
	const queryClient = getQueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["profile", "me"],
		queryFn: () => Promise.resolve(profile),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<EditProfileSocialModal />
		</HydrationBoundary>
	);
}
