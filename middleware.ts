// Protects /admin and the admin subdomain with Basic Auth
// Also rewrites admin.gobagready72.com to /admin
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USER = process.env.ADMIN_USER!;
const PASS = process.env.ADMIN_PASS!;

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";

  const isAdminHost = host.startsWith("admin.");
  const isAdminPath = url.pathname.startsWith("/admin");

  if (isAdminHost && !isAdminPath) {
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  const needsAuth = isAdminHost || isAdminPath;
  if (!needsAuth) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const [, b64] = auth.split(" ");
    const [u, p] = Buffer.from(b64, "base64").toString().split(":");
    if (u === USER && p === PASS) return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="GoBag Admin"' },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next|.*\.(?:ico|png|jpg|jpeg|svg|gif|css|js|txt|map)).*)",
  ],
};
