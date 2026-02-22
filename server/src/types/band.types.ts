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

/**
 * Profile shape returned for each band member (matches client ProfileListItem).
 */
export interface BandMemberProfileItem {
  id: string;
  pseudonyme: string;
  profilePictureKey: string | null;
  lastActiveAt: Date | null;
  city: string | null;
  departmentName: string | null;
  user: { username: string };
  _count: { followers: number };
}

/**
 * Item returned by GET /band/:slug/members.
 */
export interface BandMemberListItem {
  profile: BandMemberProfileItem;
  role: BandMemberRole;
}
