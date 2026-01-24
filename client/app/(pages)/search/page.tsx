"use client";

import { ProfileCard } from "@/components/features/profile/cards";
import {
  useSearchProfiles,
  useSearchParamsValidation,
  useSearchPageNavigation,
} from "@/hooks/features/search";
import {
  SearchPagination,
  SearchLoadingState,
  SearchErrorState,
  SearchEmptyState,
} from "@/components/features/search";

export default function Page() {
  const validatedParams = useSearchParamsValidation();
  const { handlePageChange } = useSearchPageNavigation(
    validatedParams.query
  );

  const { data, isLoading, isError } = useSearchProfiles(
    validatedParams.query,
    validatedParams.page
  );

  if (!validatedParams.query) {
    return <SearchEmptyState message="Aucune recherche fournie." />;
  }

  if (isLoading) {
    return <SearchLoadingState query={validatedParams.query} />;
  }

  if (isError || !data) {
    return <SearchErrorState />;
  }

  const { profiles, totalFound, totalPages, page: currentPage } = data;

  if (!profiles || profiles.length === 0) {
    return <SearchEmptyState query={validatedParams.query} />;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Résultats pour "{validatedParams.query}" · {totalFound} trouvé
        {totalFound > 1 ? "s" : ""}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {totalPages > 1 && (
        <SearchPagination
          currentPage={currentPage}
          totalPages={totalPages}
          query={validatedParams.query}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
