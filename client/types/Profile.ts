export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  soundcloud?: string;
}

export interface LastFollowers {
  city: string | null;
  departmentName: string | null;
  pseudonyme: string;
  username: string;
  followersCount: number;
  profilePictureKey: string | null;
  lastActiveAt: Date | null;
}
export interface Profile {
  userId: string;
  username: string;
  description: string;
  pseudonyme: string;
  age: number | null;
  country: string;
  city: string;
  zipCode: string;
  departmentName: string | null;
  profilePictureKey: string | null;
  role: "MUSICIAN" | string;
  concertsPlayed:
    | "NOT_SPECIFIED"
    | "LESS_THAN_10"
    | "TEN_TO_FIFTY"
    | "FIFTY_TO_HUNDRED"
    | "MORE_THAN_HUNDRED";
  rehearsalsPerWeek:
    | "NOT_SPECIFIED"
    | "ONCE_PER_WEEK"
    | "TWO_TO_THREE_PER_WEEK"
    | "MORE_THAN_THREE_PER_WEEK";
  practiceType: "NOT_SPECIFIED" | "HOBBY" | "ACTIVE";
  isLookingForBand: boolean;
  socialLinks: SocialLinks;
  followers: number;
  following: number;
  lastFollowers: LastFollowers[];
  instruments: {
    instrumentTypeId: string;
    level: string | null;
    order: number;
    instrumentType: {
      name: string;
      profession: string | null;
    };
  }[];
  genres: string[];
  styles?: string[];
  lastSeen?: string;
  lastActiveAt?: Date | null;
  createdAt?: string;
}

//  Followers/following lists
export interface ProfileListItem {
  id: string;
  pseudonyme: string;
  profilePictureKey: string | null;
  lastActiveAt: Date | null;
  city: string | null;
  departmentName: string | null;
  user: {
    username: string;
  };
  _count: {
    followers: number;
  };
}

export interface SearchResult {
  id: string;
  pseudonyme: string;
  profilePictureKey: string | null;
  lastActiveAt: Date | null;
  city: string | null;
  departmentName: string | null;
  user: {
    username: string;
  };
  _count: {
    followers: number;
  };
}

export interface AutocompleteResponse {
  profiles: SearchResult[];
  hasMore: boolean;
  totalFound: number;
}

export interface SearchResponse {
  profiles: SearchResult[];
  nextCursor: string | null;
  hasMore: boolean;
  totalFound: number;
}
