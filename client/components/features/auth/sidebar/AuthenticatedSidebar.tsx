import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { AppSidebar } from "@/components/features/auth/sidebar/AppSidebar";
import { headers } from "next/headers";
import { isPublicRoute } from "@/utils/utils";

export async function AuthenticatedSidebar() {
  const session = await getServerSession(authOptions);
  const headersList = await headers();
  const pathname = headersList.get("x-current-path") || "";

  if (!session?.user || isPublicRoute(pathname)) {
    return null;
  }

  return <AppSidebar />;
}
