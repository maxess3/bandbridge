import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SidebarAuthContainer } from "@/components/features/auth/sidebar/SidebarAuthContainer";
import { headers } from "next/headers";
import { isPublicRoute } from "@/utils/utils";

export async function SidebarAuth() {
	const session = await getServerSession(authOptions);
	const headersList = await headers();
	const pathname = headersList.get("x-current-path") || "";

	if (!session?.user || isPublicRoute(pathname)) {
		return <div className="hidden" />;
	}

	return <SidebarAuthContainer />;
}
