export function isPublicRoute(pathname: string): boolean {
  const PUBLIC_LAYOUT_ROUTES = ["/articles"];
  return PUBLIC_LAYOUT_ROUTES.some((route) => pathname.startsWith(route));
}
