import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ProfileCard } from "@/components/features/profile/cards";
import { SearchResponse } from "@/types/Search";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; cursor?: string }>;
}

export default async function Page({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const cursor = typeof params.cursor === "string" ? params.cursor : undefined;

  if (!query) {
    return <div className="p-4">Aucune recherche fournie.</div>;
  }

  const session = await getServerSession(authOptions);

  if (!session?.backendTokens?.accessToken) {
    return (
      <div className="p-4">
        Vous devez être connecté pour effectuer une recherche.
      </div>
    );
  }

  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/profile/search?q=${encodeURIComponent(query)}&limit=10${
    cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""
  }`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.backendTokens.accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-4">Une erreur est survenue lors de la recherche.</div>
    );
  }

  const data = (await res.json()) as SearchResponse;
  const { profiles, hasMore, nextCursor, totalFound } = data;

  if (!profiles || profiles.length === 0) {
    return (
      <div className="p-4">
        <div className="mb-4 text-sm text-muted-foreground">
          Résultats pour "{query}"
        </div>
        <div>Aucun profil trouvé.</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm text-muted-foreground">
        Résultats pour "{query}" · {totalFound} affichés
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        {cursor ? (
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            className="text-sm text-blue-600 hover:underline"
            aria-label="Revenir au début des résultats"
          >
            Retour au début
          </Link>
        ) : (
          <span />
        )}

        {hasMore && nextCursor ? (
          <Link
            href={`/search?q=${encodeURIComponent(
              query
            )}&cursor=${encodeURIComponent(nextCursor)}`}
            className="text-sm px-3 py-1.5 border rounded hover:bg-accent"
            aria-label="Voir plus de résultats"
          >
            Suivant
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">
            Fin des résultats
          </span>
        )}
      </div>
    </div>
  );
}
