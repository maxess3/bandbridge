export type BandMemberRole = "MEMBER" | "ADMIN";

export interface Band {
  id: string;
  name: string;
  slug: string;
  profilePictureKey: string | null;
  description: string | null;
  city?: string | null;
  departmentName?: string | null;
  role?: BandMemberRole;
  _count?: {
    bandMembers: number;
  };
}

// Bands list items (for paginated lists)
export interface BandListItem {
  id: string;
  name: string;
  slug: string;
  profilePictureKey: string | null;
  description: string | null;
  city: string | null;
  departmentName: string | null;
  _count: {
    bandMembers: number;
  };
}

// Group page (band by slug) – includes genres, hiringAds count, optional role when authenticated
export interface BandPageData {
  id: string;
  name: string;
  slug: string;
  profilePictureKey: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  zipCode: string | null;
  departmentName: string | null;
  genres: string[];
  _count: {
    bandMembers: number;
    hiringAds: number;
  };
  role?: BandMemberRole;
}
