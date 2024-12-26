import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("refreshToken");
	if (!token) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}
	return NextResponse.next();
}

// Protected route
export const config = {
	matcher: ["/me/:path*"],
};
