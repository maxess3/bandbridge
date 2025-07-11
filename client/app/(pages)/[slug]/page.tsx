import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { profileServices } from "@/services/profileServices";
import { Profile } from "@/components/features/profile/Profile";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/react-query/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
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
    title: `${profile.firstName} (@${profile.username}) | Chordeus`,
    description: `Découvrez le profil de ${profile.firstName} sur Chordeus`,
  };
}

export default async function Root({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);

  // Check if the profile exists
  const profile = await getProfile(slug);

  // Check if the user is the owner of the profile
  const isOwner = profile.userId === session?.user.id;

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
