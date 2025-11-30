/**
 * Types for profile-related responses and data structures.
 */

/**
 * Formatted follower information.
 */
export interface FormattedFollower {
  pseudonyme: string;
  username: string;
  profilePictureKey: string | null;
  lastActiveAt: Date | null;
  city: string | null;
  followersCount: number;
}

/**
 * Social links formatted as an object with platform names as keys.
 */
export type FormattedSocialLinks = Record<string, string>;

/**
 * Profile response structure for public and owner endpoints.
 */
export interface ProfileResponse {
  userId: string;
  username: string;
  pseudonyme: string | null;
  age: number | null;
  country: string | null;
  zipCode: string | null;
  city: string | null;
  departmentName: string | null;
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
  createdAt: Date;
  socialLinks: FormattedSocialLinks;
  followers: number;
  following: number;
  lastFollowers: FormattedFollower[];
}
