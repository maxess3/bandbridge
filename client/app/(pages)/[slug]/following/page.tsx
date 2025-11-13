import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileList } from "@/components/features/profile/cards";
import { profileServices } from "@/services/profileServices";

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
    title: `Personnes suivies par ${profile.pseudonyme} (@${profile.username}) | Chordeus`,
    description: `Découvrez les profils suivis par ${profile.pseudonyme} sur Chordeus`,
  };
}

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
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Following</h1>
      <ProfileList
        username={slug}
        type="following"
        emptyMessage="Aucun profil suivi pour le moment"
        variant="following"
      />
    </div>
  );
}
