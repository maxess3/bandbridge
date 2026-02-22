import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { bandServices } from "@/services/bandServices";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/react-query/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

const BAND_PAGE_QUERY_KEY = ["band"];

async function getBand(id: string, accessToken?: string | null) {
  const band = await bandServices.getBand(id, accessToken);
  if (!band) {
    notFound();
  }
  return band;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const band = await getBand(id);

  return {
    title: `${band.name} | Chordeus`,
    description: band.description ?? `Découvrez le groupe ${band.name} sur Chordeus`,
  };
}

export default async function Root({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const accessToken = session?.backendTokens?.accessToken;

  const band = await getBand(id, accessToken);
  const isAdmin = band.role === "ADMIN";

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [...BAND_PAGE_QUERY_KEY, id],
    queryFn: () => Promise.resolve(band),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <h1>{band.name}</h1>
        {band.description && <p>{band.description}</p>}
        {isAdmin && (
          <p className="text-sm text-muted-foreground">
            Vous êtes administrateur de ce groupe (boutons d'édition à venir).
          </p>
        )}
      </div>
    </HydrationBoundary>
  );
}
