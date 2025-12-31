"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUserBands } from "./useUserBands";
import { useSidebarViewStore } from "@/stores/sidebarViewStore";

export function useSyncSidebarView() {
  const pathname = usePathname();
  const { data: bands, isLoading } = useUserBands();
  const { view, activeBand, setActiveBand, reset } = useSidebarViewStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for bands to be loaded
    if (isLoading || !bands) {
      setIsReady(false);
      return;
    }

    // Check if URL matches /band/[slug] pattern
    const match = pathname.match(/^\/band\/([^\/]+)/);

    if (match) {
      const bandSlug = match[1];

      // Find the band in user's bands list
      const band = bands.find((b) => b.slug === bandSlug);

      if (band) {
        // User is a member of this band
        // Only update if different from current state
        if (activeBand?.id !== band.id || view !== "band") {
          setActiveBand(band);
        }
      } else {
        // User is not a member of this band
        // Return to user view if currently in band view
        if (view === "band") {
          reset();
        }
      }
    } else {
      // URL doesn't match /band/[slug] pattern
      // Return to user view if currently in band view
      if (view === "band") {
        reset();
      }
    }

    // Mark as ready after synchronization is complete
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, bands, isLoading]);

  return { isReady };
}
