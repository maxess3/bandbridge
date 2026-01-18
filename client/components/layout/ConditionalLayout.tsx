import DefaultNavbar from "@/components/layout/header/navbar/default/DefaultNavbar";
import Footer from "@/components/layout/footer/Footer";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarProvider, SidebarManagerProvider, SidebarInset, SidebarManager, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/layout/sidebar/site-header";

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
    <div
      className="h-screen flex flex-col"
      style={{ "--header-height": "3.2rem" } as React.CSSProperties}
    >
      <SidebarManagerProvider>
        <SiteHeader />
        <SidebarProvider className="h-[calc(100vh-var(--header-height))] flex-1 min-h-0">
          <SidebarManager name="left">
            <Sidebar
              side="left"
              className="border-r pt-(--header-height)"
            >
              <SidebarContent className="wrap-break-word">Firstabcde</SidebarContent>
            </Sidebar>
          </SidebarManager>
          <SidebarInset className="flex-1 min-h-0">
            <SidebarProvider
              className="flex-1 min-h-0"
              style={{
                "--sidebar-width": "12rem",
                "--sidebar-width-icon": "12rem",
              } as React.CSSProperties}
            >
              <SidebarManager name="second">
                <AppSidebar />
              </SidebarManager>
              <SidebarInset className="flex-1 min-h-0 overflow-auto">
                <main>{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </SidebarInset>
        </SidebarProvider>
      </SidebarManagerProvider>
    </div>
  )
}
