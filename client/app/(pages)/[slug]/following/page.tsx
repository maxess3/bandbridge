import { ProfileList } from "@/components/features/profile/shared/ProfileList";
import { notFound } from "next/navigation";

export default async function FollowingPage({
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
				type="following"
				title="Profils suivis"
				emptyMessage="Aucun profil suivi pour le moment"
				variant="following"
			/>
		</div>
	);
}
