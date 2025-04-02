export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  soundcloud?: string;
}

export interface Profile {
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
}
