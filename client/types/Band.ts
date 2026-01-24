export interface Band {
  id: string;
  name: string;
  slug: string;
  profilePictureKey: string | null;
  description: string | null;
  city?: string | null;
  departmentName?: string | null;
  _count?: {
    members: number;
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
    members: number;
  };
}
