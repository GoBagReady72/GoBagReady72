// Vercel Edge Function for Basic Auth + admin subdomain rewrite
export const config = { runtime: "edge" } as const;

function parseBasicAuth(header: string | null) {
  if (!header || !header.startsWith("Basic ")) return { u: "", p: "" };
  const b64 = header.split(" ")[1] || "";
  try {
    const [u, p] = atob(b64).split(":");
    return { u, p } as { u: string; p: string };
  } catch {
    return { u: "", p: "" };
  }
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const host = req.headers.get("host") || "";
  const isAdminHost = host.startsWith("admin.");
  const isAdminPath = url.pathname.startsWith("/admin");

  if (isAdminHost || isAdminPath) {
    const { u, p } = parseBasicAuth(req.headers.get("authorization"));
    const USER = (process.env.ADMIN_USER as string) || "";
    const PASS = (process.env.ADMIN_PASS as string) || "";

    if (!(USER && PASS && u === USER && p === PASS)) {
      return new Response("Authentication required.", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="GoBag Admin"' },
      });
    }

    // If on admin subdomain but not /admin path, rewrite to /admin
    if (isAdminHost && !isAdminPath) {
      const target = new URL("/admin", url).toString();
      return fetch(target, req);
    }
  }

  // Fall-through to app
  return fetch(req);
}
