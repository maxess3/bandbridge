import DefaultNavbar from "@/components/layout/header/navbar/default/DefaultNavbar";
import Footer from "@/components/layout/footer/Footer";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarProvider, SidebarManagerProvider, SidebarInset, SidebarManager, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/sidebar/site-header";
import { NavFirstSidebar } from "@/components/layout/sidebar/nav-first-sidebar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  isPublic: boolean;
}

const HEADER_HEIGHT = "3.2rem";
const SIDEBAR_WIDTH = "12rem";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full mx-auto">
      <DefaultNavbar />
      <div className="max-w-7xl mx-auto p-6">{children}</div>
      <Footer />
    </div>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const headerHeightStyle = { "--header-height": HEADER_HEIGHT } as React.CSSProperties;
  const sidebarWidthStyle = {
    "--sidebar-width": SIDEBAR_WIDTH,
    "--sidebar-width-icon": SIDEBAR_WIDTH,
  } as React.CSSProperties;

  return (
    <div className="h-screen flex flex-col" style={headerHeightStyle}>
      <SidebarManagerProvider>
        <SiteHeader />
        <SidebarProvider className="h-[calc(100vh-var(--header-height))] flex-1 min-h-0">
          <SidebarManager name="left">
            <Sidebar side="left" className="border-r pt-(--header-height)">
              <SidebarContent className="wrap-break-word">
                <NavFirstSidebar />
              </SidebarContent>
            </Sidebar>
          </SidebarManager>
          <SidebarInset className="flex-1 min-h-0">
            <SidebarProvider className="flex-1 min-h-0" style={sidebarWidthStyle}>
              <SidebarManager name="second">
                <AppSidebar />
              </SidebarManager>
              <SidebarInset className="flex-1 min-h-0 overflow-auto">
                {children}
              </SidebarInset>
            </SidebarProvider>
          </SidebarInset>
        </SidebarProvider>
      </SidebarManagerProvider>
    </div>
  );
}

export async function ConditionalLayout({
  children,
  isPublic,
}: ConditionalLayoutProps) {
  return isPublic ? (
    <PublicLayout>{children}</PublicLayout>
  ) : (
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  );
}
