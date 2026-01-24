"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { ProfileCard } from "@/components/features/profile/cards";
import { MusiciansPagination } from "@/components/features/profile/MusiciansPagination";
import { useAllMusicians } from "@/hooks/features/profile";
import { allProfilesQuerySchema } from "@/lib/zod";

const MusiciansLoadingState = () => (
  <div className="p-4">
    <div className="mb-4 text-sm text-muted-foreground">
      Chargement des musiciens...
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

const MusiciansErrorState = () => (
  <div className="p-4 text-center">
    <p className="text-red-500 mb-4">
      Une erreur est survenue lors du chargement des musiciens.
    </p>
  </div>
);

const MusiciansEmptyState = () => (
  <div className="p-4 text-center">
    <p className="text-muted-foreground">Aucun musicien trouvé.</p>
  </div>
);

export default function MusiciansPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const validatedParams = useMemo(() => {
    const params = {
      page: searchParams.get("page") || undefined,
    };

    const result = allProfilesQuerySchema.safeParse(params);

    if (result.success) {
      return {
        page: result.data.page,
      };
    }

    return {
      page: 1,
    };
  }, [searchParams]);

  const { data, isLoading, isError } = useAllMusicians(
    validatedParams.page
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/musicians?${params.toString()}`);
  };

  if (isLoading) {
    return <MusiciansLoadingState />;
  }

  if (isError || !data) {
    return <MusiciansErrorState />;
  }

  const { profiles, totalFound, totalPages, page: currentPage } = data;

  if (!profiles || profiles.length === 0) {
    return <MusiciansEmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {totalFound} musicien{totalFound > 1 ? "s" : ""} trouvé
        {totalFound > 1 ? "s" : ""}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {totalPages > 1 && (
        <MusiciansPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
