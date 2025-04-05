import { ReactNode } from "react";
import { ProfileContext } from "@/context/ProfileContext";
import { Profile } from "@/types/Profile";

interface ProfileProviderProps {
  children: ReactNode;
  isPublic: boolean;
  profile: Profile;
}

export function ProfileProvider({
  children,
  isPublic,
  profile,
}: ProfileProviderProps) {
  return (
    <ProfileContext.Provider value={{ isPublic, profile }}>
      {children}
    </ProfileContext.Provider>
  );
}
