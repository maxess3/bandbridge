"use client";
import { Profile } from "@/types/Profile";
import { createContext, useContext } from "react";

interface ProfileContextType {
  isPublic: boolean;
  profile: Profile;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
