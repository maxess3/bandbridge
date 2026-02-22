"use client";

import { ProfileCard } from "@/components/features/profile/cards";
import { useBandMembers } from "@/hooks/features/band/useBandMembers";

const MembersLoadingSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="h-24 bg-muted animate-pulse rounded-lg"
        aria-hidden
      />
    ))}
  </div>
);

const MembersErrorState = () => (
  <p className="text-destructive">
    Une erreur est survenue lors du chargement des membres.
  </p>
);

const MembersEmptyState = () => (
  <p className="text-muted-foreground">Aucun membre dans ce groupe.</p>
);

interface BandMembersGridProps {
  slug: string;
}

export function BandMembersGrid({ slug }: BandMembersGridProps) {
  const { data: members, isLoading, isError } = useBandMembers(slug);

  if (isLoading) {
    return <MembersLoadingSkeleton />;
  }

  if (isError) {
    return <MembersErrorState />;
  }

  if (!members || members.length === 0) {
    return <MembersEmptyState />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member) => (
        <ProfileCard
          key={member.profile.id}
          profile={member.profile}
        />
      ))}
    </div>
  );
}
