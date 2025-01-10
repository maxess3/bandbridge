import { cookies } from "next/headers";

export async function isAuthenticated(): Promise<boolean> {
  const reqCookies = await cookies();
  const token = reqCookies.get("token");
  return !!token?.value;
}
