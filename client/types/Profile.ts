export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  soundcloud?: string;
}

export interface LastFollowers {
  city: string;
  firstName: string;
  followersCount: number;
  username: string;
}

export interface Profile {
  userId: string;
  firstName: string;
  username: string;
  birthDate: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  country: string;
  zipCode: string;
  role: "MUSICIAN" | string;
  city: string;
  socialLinks: SocialLinks;
  followers: number;
  following: number;
  lastFollowers: LastFollowers[];
  instruments: string[];
  styles: string[];
  lastSeen: string;
}
