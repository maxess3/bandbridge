import DefaultNavbar from "@/components/layout/header/navbar/default/DefaultNavbar";
import Footer from "@/components/layout/footer/Footer";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NavbarAuth } from "@/components/layout/header/navbar/auth/NavbarAuth";

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
        <div className="max-w-7xl mx-auto p-6">{children}</div>
        <Footer />
      </div>
    );
  }

  // If user is authenticated and not a public route, display authenticated navbar + content
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavbarAuth />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
