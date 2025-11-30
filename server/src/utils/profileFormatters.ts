import {
  FormattedSocialLinks,
  FormattedFollower,
  ProfileResponse,
} from "../types/profile.types";

/**
 * Formats social links from array format to object format.
 * Converts platform names to lowercase keys.
 *
 * @param socialLinks - Array of social links with platform and url
 * @returns Object with platform names (lowercase) as keys and URLs as values
 *
 * @example
 * ```typescript
 * const links = [
 *   { platform: "YOUTUBE", url: "https://youtube.com/user" },
 *   { platform: "INSTAGRAM", url: "https://instagram.com/user" }
 * ];
 * formatSocialLinks(links);
 * // Returns: { youtube: "https://youtube.com/user", instagram: "https://instagram.com/user" }
 * ```
 */
export function formatSocialLinks(
  socialLinks: Array<{ platform: string; url: string }> | null | undefined
): FormattedSocialLinks {
  if (!socialLinks || socialLinks.length === 0) {
    return {};
  }

  return Object.fromEntries(
    socialLinks.map((link) => [link.platform.toLowerCase(), link.url])
  );
}

/**
 * Formats a list of followers to the standard response format.
 *
 * @param followers - Array of follower profiles from Prisma
 * @returns Array of formatted follower objects
 */
export function formatFollowersList(
  followers:
    | Array<{
        pseudonyme: string;
        profilePictureKey: string | null;
        lastActiveAt: Date | null;
        city: string | null;
        user: {
          username: string;
        };
        _count: { followers: number };
      }>
    | null
    | undefined
): FormattedFollower[] {
  if (!followers || followers.length === 0) {
    return [];
  }

  return followers.map((follower) => ({
    pseudonyme: follower.pseudonyme,
    username: follower.user.username,
    profilePictureKey: follower.profilePictureKey,
    lastActiveAt: follower.lastActiveAt,
    city: follower.city,
    followersCount: follower._count.followers,
  }));
}

/**
 * Formats a complete profile response from user and profile data.
 *
 * @param user - User data from Prisma
 * @param profile - Profile data from Prisma
 * @param age - Calculated age (can be null)
 * @param socialLinks - Formatted social links object
 * @param lastFollowers - Formatted followers list
 * @returns Complete profile response object
 */
export function formatProfileResponse(
  user: {
    id: string;
    username: string;
    created_at: Date;
    birthDate: Date | null;
  },
  profile: {
    userId: string;
    pseudonyme: string | null;
    role: string | null;
    description: string | null;
    concertsPlayed: string | null;
    rehearsalsPerWeek: string | null;
    practiceType: string | null;
    isLookingForBand: boolean;
    genres: string[];
    instruments: any[];
    profilePictureKey: string | null;
    lastActiveAt: Date | null;
    country: string | null;
    zipCode: string | null;
    city: string | null;
    departmentName: string | null;
    _count?: {
      followers: number;
      following: number;
    } | null;
  },
  age: number | null,
  socialLinks: FormattedSocialLinks,
  lastFollowers: FormattedFollower[]
): ProfileResponse {
  return {
    userId: profile.userId,
    username: user.username,
    pseudonyme: profile.pseudonyme,
    age: age,
    country: profile.country,
    zipCode: profile.zipCode,
    city: profile.city,
    departmentName: profile.departmentName,
    role: profile.role,
    description: profile.description,
    concertsPlayed: profile.concertsPlayed,
    rehearsalsPerWeek: profile.rehearsalsPerWeek,
    practiceType: profile.practiceType,
    isLookingForBand: profile.isLookingForBand,
    genres: profile.genres,
    instruments: profile.instruments,
    profilePictureKey: profile.profilePictureKey,
    lastActiveAt: profile.lastActiveAt,
    createdAt: user.created_at,
    socialLinks: socialLinks,
    followers: profile._count?.followers || 0,
    following: profile._count?.following || 0,
    lastFollowers: lastFollowers,
  };
}
