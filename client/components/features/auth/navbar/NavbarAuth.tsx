import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { headers } from "next/headers";
import { isPublicRoute } from "@/utils/utils";
import { NavbarAuthContainer } from "@/components/features/auth/navbar/NavbarAuthContainer";

export async function NavbarAuth() {
	const session = await getServerSession(authOptions);
	const headersList = await headers();
	const pathname = headersList.get("x-current-path") || "";

	if (!session?.user || isPublicRoute(pathname)) {
		return null;
	}

	return <NavbarAuthContainer />;
}
