"use client";

import { useEffect, useState } from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const TRANSITION_DURATION = 150; // ms

export const NavUpgradePro = () => {
  const { state } = useSidebar();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);

    if (state === "expanded") {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, TRANSITION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [state]);

  if (state === "collapsed" || !isVisible) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="p-4 flex flex-col gap-y-6 border rounded-lg">
          <div className="flex flex-col gap-y-2">
            <div className="text-sm font-medium opacity-90">
              Passer à la version pro
            </div>
            <p className="text-xs opacity-70 leading-4.5">
              Débloque plus de fonctionnalités et soutiens le développement de
              l'application.
            </p>
          </div>
          <Button>Upgrade</Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
