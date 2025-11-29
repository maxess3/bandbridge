"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useFocusManager } from "@/contexts/FocusManagerContext";
import { createDelayedFunction } from "@/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { PROFILE_QUERY_KEY } from "@/hooks/features/profile/useProfile";
import { Button } from "@/components/ui/button";
import { ChatIcon, PlayIcon, ShareFatIcon } from "@phosphor-icons/react";
import { FollowButton } from "@/components/features/profile/buttons/FollowButton";
import { ShareProfileModal } from "@/components/features/profile/modals/ShareProfileModal";
import { PencilIcon } from "@phosphor-icons/react";
import Link from "next/link";

interface FollowData {
  isFollowing: boolean;
  targetUsername: string;
  timestamp: string;
}

export const ProfileActions = ({
  username,
  pseudonyme,
  isOwner,
}: {
  username: string;
  pseudonyme: string;
  isOwner: boolean;
}) => {
  const { data: session } = useSession();
  const { captureFocus } = useFocusManager();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const delayedQueryFn = createDelayedFunction(async () => {
    const { data } = await axiosAuth.get(`/profile/following/${username}`);
    return data;
  }, 400);

  const { data: followData, isLoading: isFollowLoading } = useQuery({
    queryKey: ["isFollowing", username],
    queryFn: delayedQueryFn,
    enabled: !!username && !isOwner && !!session?.user,
  });

  // Mutation avec optimistic updates selon les bonnes pratiques React Query
  const { mutate: toggleFollow, isPending: isFollowPending } = useMutation({
    mutationFn: async () => {
      const endpoint = followData?.isFollowing ? "unfollow" : "follow";
      await axiosAuth.post(`/profile/${endpoint}/${username}`);
    },
    onMutate: async () => {
      // Annuler les requêtes en cours pour éviter qu'elles n'écrasent la mise à jour optimiste
      await queryClient.cancelQueries({ queryKey: ["isFollowing", username] });

      // Capturer l'état précédent
      const previousFollowData = queryClient.getQueryData([
        "isFollowing",
        username,
      ]);

      // Mise à jour optimiste immédiate
      queryClient.setQueryData<FollowData>(
        ["isFollowing", username],
        (old: FollowData | undefined) => ({
          ...old!,
          isFollowing: !old?.isFollowing,
        })
      );

      // Retourner le contexte pour une éventuelle restauration en cas d'erreur
      return { previousFollowData };
    },
    onError: (err, variables, context) => {
      // En cas d'erreur, restaurer l'état précédent
      if (context?.previousFollowData) {
        queryClient.setQueryData(
          ["isFollowing", username],
          context.previousFollowData
        );
      }
    },
    onSettled: () => {
      // Invalider la requête pour s'assurer que les données sont synchronisées avec le serveur
      queryClient.invalidateQueries({ queryKey: ["isFollowing", username] });
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });

  if (!session?.user) return null;

  if (isOwner) {
    return (
      <>
        <div className="flex gap-2">
          <Link
            href={`/${username}/edit/profile/general`}
            onClick={captureFocus}
            className="border font-medium px-4 flex h-11 gap-2 justify-center items-center hover:bg-hover rounded-md"
          >
            <PencilIcon weight="bold" />
            Modifier le résumé
          </Link>
          <Button className="h-11 w-11 rounded-md" variant="outline">
            <ChatIcon weight="bold" />
          </Button>
          <Button
            className="h-11 w-11 rounded-md"
            variant="outline"
            onClick={() => {
              captureFocus();
              setIsShareModalOpen(true);
            }}
          >
            <ShareFatIcon weight="bold" />
          </Button>
        </div>
        <ShareProfileModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          username={username}
          pseudonyme={pseudonyme}
        />
      </>
    );
  }

  // Afficher un skeleton pendant le chargement
  if (isFollowLoading || followData === undefined) {
    return (
      <div className="flex gap-2 h-[44px] bg-transparent">
        <div className="w-24 bg-foreground/20 animate-pulse rounded-md" />
        <div className="w-11 bg-foreground/20 animate-pulse rounded-md" />
        <div className="w-11 bg-foreground/20 animate-pulse rounded-md" />
        <div className="w-11 bg-foreground/20 animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2">
        <FollowButton
          isFollowing={followData.isFollowing}
          onToggleFollow={toggleFollow}
          isPending={isFollowPending}
        />
        <Button className="h-11 w-11 rounded-md" variant="outline">
          <PlayIcon weight="fill" />
        </Button>
        <Button className="h-11 w-11 rounded-md" variant="outline">
          <ChatIcon weight="bold" />
        </Button>
        <Button
          className="h-11 w-11 rounded-md"
          variant="outline"
          onClick={() => {
            captureFocus();
            setIsShareModalOpen(true);
          }}
        >
          <ShareFatIcon weight="bold" />
        </Button>
      </div>
      <ShareProfileModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        username={username}
        pseudonyme={pseudonyme}
      />
    </>
  );
};
