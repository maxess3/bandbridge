import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ProfileLayout } from "@/components/pages/profile";
import { profileServices } from "@/services/profileServices";
import { ProfileOwner } from "@/components/pages/profile/ProfileOwner";

export default async function Root({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  if (slug === session?.user.username) {
    return <ProfileOwner />;
  }

  const profile = await profileServices.getProfile(slug);
  return <ProfileLayout profile={profile} isOwner={false} />;
}
