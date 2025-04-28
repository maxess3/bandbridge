import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { profileServices } from "@/services/profileServices";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/react-query/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { EditProfileGeneralModal } from "@/components/modal/EditProfileGeneralModal";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);

  // Check if the profile exists
  const profile = await profileServices.getProfile(slug);
  if (!profile) {
    notFound();
  }

  // Check if the user is the owner of the profile
  if (!session || profile?.userId !== session?.user.id) {
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
      <EditProfileGeneralModal />
    </HydrationBoundary>
  );
}
