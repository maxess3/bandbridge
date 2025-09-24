"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/ui/use-mobile";

type SidebarGlobalContextType = {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleMobileSidebar: () => void;
};

const SidebarGlobalContext = createContext<SidebarGlobalContextType | null>(
  null
);

export const useSidebarGlobal = () => {
  const context = useContext(SidebarGlobalContext);
  if (!context) {
    throw new Error(
      "useSidebarGlobal must be used within a SidebarGlobalProvider"
    );
  }
  return context;
};

interface SidebarGlobalProviderProps {
  children: React.ReactNode;
}

export const SidebarGlobalProvider: React.FC<SidebarGlobalProviderProps> = ({
  children,
}) => {
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileSidebar = useCallback(() => {
    setOpenMobile((prev) => !prev);
  }, []);

  const value: SidebarGlobalContextType = {
    openMobile,
    setOpenMobile,
    toggleMobileSidebar,
  };

  return (
    <SidebarGlobalContext.Provider value={value}>
      {children}
    </SidebarGlobalContext.Provider>
  );
};
