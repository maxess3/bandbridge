import { notFound } from "next/navigation";
import { Metadata } from "next";
import { profileServices } from "@/services/profileServices";
import { EditProfileSocialModal } from "@/components/modal/EditProfileSocialModal";

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
		title: `${profile.firstName} (@${profile.username}) | Chordeus`,
		description: `Découvrez le profil de ${profile.firstName} sur Chordeus`,
	};
}

export default function Page() {
	return <EditProfileSocialModal />;
}
