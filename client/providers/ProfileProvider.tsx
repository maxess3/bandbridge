import { ReactNode } from "react";
import { ProfileContext } from "@/context/ProfileContext";

interface ProfileProviderProps {
  children: ReactNode;
  isPublic: boolean;
  profile: any;
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
