import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { profileServices } from "@/services/profileServices";
import { Profile } from "@/components/pages/profile/Profile";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/react-query/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Root({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	// Check if the profile exists
	const profile = await profileServices.getProfile(slug);
	if (!profile) {
		notFound();
	}

	// Check if the user is the owner of the profile
	const session = await getServerSession(authOptions);
	const isOwner = slug === session?.user.username;

	// Prefetch the profile
	const queryClient = getQueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["profile", isOwner ? "me" : slug],
		queryFn: () => Promise.resolve(profile),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Profile isOwner={isOwner} slug={slug} />
		</HydrationBoundary>
	);
}
