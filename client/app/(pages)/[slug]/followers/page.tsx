import { ProfileList } from "@/components/features/profile/shared/ProfileList";
import { notFound } from "next/navigation";
import { profileServices } from "@/services/profileServices";
import { Metadata } from "next";

async function getProfile(slug: string) {
	const profile = await profileServices.getProfile(slug);
	if (!profile) {
		notFound();
	}
	return profile;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const profile = await getProfile(slug);

	return {
		title: `Personnes qui suivent ${profile.pseudonyme} (@${profile.username}) | Chordeus`,
		description: `Découvrez les profils qui suivent ${profile.pseudonyme} sur Chordeus`,
	};
}

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
			<h1 className="text-2xl font-bold mb-6">Followers</h1>
			<ProfileList
				username={slug}
				type="followers"
				emptyMessage="Aucun follower pour le moment"
				variant="follower"
			/>
		</div>
	);
}
