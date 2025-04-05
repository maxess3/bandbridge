import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ClientProfile } from "@/components/pages/profile/ClientProfile";
import { notFound } from "next/navigation";

export default async function Root({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { slug } = await params;

  if (!session || slug !== session?.user.username) {
    notFound();
  }

  return <ClientProfile />;
}
