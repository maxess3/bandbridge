import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "next/image";
import Logo from "@/public/logo/chordeus_logo.png";

export const SidebarNavHeader = () => {
  return (
    <SidebarMenu className="px-3 pt-3">
      <SidebarMenuItem>
        <div className="font-medium flex items-center gap-x-2.5 w-full min-w-40">
          <Image src={Logo} alt="Logo" width={36} height={36} />
          <span className="text-2xl font-semibold">chordeus</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
