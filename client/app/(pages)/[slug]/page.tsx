import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ProfileLayout } from "@/components/pages/profile";
import { profileServices } from "@/services/profileServices";
import { ClientProfile } from "@/components/pages/profile/ClientProfile";

export default async function Root({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  // If slug is the same as the current user, use the client component
  if (slug === session?.user.username) {
    return <ClientProfile />;
  }

  // Otherwise, use the server fetch for SEO
  const profile = await profileServices.getProfile(slug);
  return <ProfileLayout profile={profile} isPublic={true} />;
}
