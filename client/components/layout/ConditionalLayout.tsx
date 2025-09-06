import DefaultNavbar from "@/components/layout/header/navbar/default/DefaultNavbar";
import { NavbarAuth } from "@/components/layout/header/navbar/auth/NavbarAuth";
import Footer from "@/components/layout/footer/Footer";
import { SidebarGlobalProvider } from "@/contexts/SidebarGlobalContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarAuth } from "@/components/layout/sidebar/SidebarAuth";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  isPublic: boolean;
}

export async function ConditionalLayout({
  children,
  isPublic,
}: ConditionalLayoutProps) {
  // If user is not authenticated or is a public route, display navbar + footer
  if (isPublic) {
    return (
      <div className="w-full mx-auto">
        <DefaultNavbar />
        <div className="max-w-7xl mx-auto px-6">{children}</div>
        <Footer />
      </div>
    );
  }

  // If user is authenticated and not a public route, display authenticated navbar + content
  return (
    <SidebarGlobalProvider>
      <NavbarAuth />
      <SidebarProvider>
        <SidebarAuth />
        <SidebarInset>
          <div className="w-full mx-auto">
            <div className="max-w-7xl mx-auto px-6">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SidebarGlobalProvider>
  );
}
