"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { BandCard } from "@/components/features/band/cards";
import { BandsPagination } from "@/components/features/band/BandsPagination";
import { useAllBands } from "@/hooks/features/band/useAllBands";
import { allBandsQuerySchema } from "@/lib/zod";

const BandsLoadingState = () => (
  <div className="p-4">
    <div className="mb-4 text-sm text-muted-foreground">
      Chargement des groupes...
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

const BandsErrorState = () => (
  <div className="p-4 text-center">
    <p className="text-red-500 mb-4">
      Une erreur est survenue lors du chargement des groupes.
    </p>
  </div>
);

const BandsEmptyState = () => (
  <div className="p-4 text-center">
    <p className="text-muted-foreground">Aucun groupe trouvé.</p>
  </div>
);

export default function BandsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const validatedParams = useMemo(() => {
    const params = {
      page: searchParams.get("page") || undefined,
    };

    const result = allBandsQuerySchema.safeParse(params);

    if (result.success) {
      return {
        page: result.data.page,
      };
    }

    return {
      page: 1,
    };
  }, [searchParams]);

  const { data, isLoading, isError } = useAllBands(validatedParams.page);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/bands?${params.toString()}`);
  };

  if (isLoading) {
    return <BandsLoadingState />;
  }

  if (isError || !data) {
    return <BandsErrorState />;
  }

  const { bands, totalFound, totalPages, page: currentPage } = data;

  if (!bands || bands.length === 0) {
    return <BandsEmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {totalFound} groupe{totalFound > 1 ? "s" : ""} trouvé
        {totalFound > 1 ? "s" : ""}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bands.map((band) => (
          <BandCard key={band.id} band={band} />
        ))}
      </div>

      {totalPages > 1 && (
        <BandsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
