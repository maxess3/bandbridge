import { notFound } from "next/navigation";
import { ProfileLayout } from "@/components/pages/profile";
import { Profile } from "@/types/Profile";

async function getProfile(username: string): Promise<Profile> {
  const res = await fetch(`${process.env.API_URL}/profile/${username}`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 3600,
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
  isPublic = true,
}: {
  params: Promise<{ slug: string }>;
  isPublic: boolean;
}) {
  const { slug } = await params;

  const profile = await getProfile(slug);
  return <ProfileLayout profile={profile} isPublic={isPublic} />;
}
