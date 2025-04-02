import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ProfileLayout } from "@/components/pages/profile";
import { Profile } from "@/types/Profile";
import { ClientProfile } from "@/components/pages/profile/ClientProfile";

async function getProfile(username: string): Promise<Profile> {
  const res = await fetch(`${process.env.API_URL}/profile/${username}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Le profil ne peut pas être récupéré");
  }
  return res.json();
}

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
  const profile = await getProfile(slug);
  return <ProfileLayout profile={profile} isPublic={true} />;
}
