/**
 * Types for band-related responses and data structures.
 */

import type { BandMemberRole, MusicGenre } from "../generated/client";

/**
 * Band data returned by GET /band/:slug (group page).
 */
export interface BandBySlugResult {
  id: string;
  name: string;
  slug: string;
  profilePictureKey: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  zipCode: string | null;
  departmentName: string | null;
  genres: MusicGenre[];
  _count: { bandMembers: number; hiringAds: number };
  role?: BandMemberRole;
}
