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
  console.log("refresh page");
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  if (!session || slug !== session?.user.username) {
    notFound();
  }

  const profile = await profileServices.getProfile(slug);
  if (!profile) {
    notFound();
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["profile", "me"],
    queryFn: () => Promise.resolve(profile),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile isOwner={true} slug={slug} />
    </HydrationBoundary>
  );
}
