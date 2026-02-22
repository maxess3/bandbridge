import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { bandServices } from "@/services/bandServices";
import { notFound, redirect } from "next/navigation";
import { BandMembersGrid } from "./BandMembersGrid";

async function getBandForGuard(id: string, accessToken?: string | null) {
  const band = await bandServices.getBand(id, accessToken);
  if (!band) {
    notFound();
  }
  return band;
}

export default async function BandMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(`/band/${id}/members`)}`);
  }

  const accessToken = session.backendTokens?.accessToken;
  const band = await getBandForGuard(id, accessToken);

  if (band.role === undefined) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-medium">Membres</h1>
        <p className="mt-2 text-muted-foreground">
          Les membres du groupe {band.name}
        </p>
      </div>
      <BandMembersGrid bandId={id} />
    </div>
  );
}
