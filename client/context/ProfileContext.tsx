"use client";

import { createContext, useContext } from "react";

interface ProfileContextType {
  isPublic: boolean;
  profile: any;
}

export const ProfileContext = createContext<ProfileContextType | null>(null);

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
