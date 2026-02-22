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
