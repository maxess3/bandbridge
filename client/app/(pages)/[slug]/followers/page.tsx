import { ProfileList } from "@/components/features/profile/shared/ProfileList";
import { notFound } from "next/navigation";

export default async function FollowersPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	if (!slug) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<ProfileList
				username={slug}
				type="followers"
				title="Abonnés"
				emptyMessage="Aucun follower pour le moment"
				variant="follower"
			/>
		</div>
	);
}
