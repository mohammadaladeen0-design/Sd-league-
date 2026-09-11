import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session cookie on every request and
 * gates access to protected routes. Admin routes additionally check
 * the user's role from the `profiles` table.
 */
export async function updateSession(request: NextRequest) {
  // Built once and mutated in place. The previous version reassigned
  // `response` to a brand-new NextResponse inside each cookie callback,
  // which silently threw away any cookie set by an earlier callback in
  // the same request — a token refresh sets both an access and a
  // refresh token cookie, so only the last one would ever survive.
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // IMPORTANT: this call can refresh the session and therefore write
  // cookies via the callbacks above — it must run before any redirect
  // is constructed, or the refreshed session is lost.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const protectedPaths = ["/profile", "/rooms", "/tournaments", "/notifications"];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));
  const isAdminPath = path.startsWith("/admin");

  // Redirects need their own Response object, but any cookies the
  // refresh above just wrote onto `response` must be carried over —
  // otherwise a mid-flight token refresh gets discarded on redirect.
  function redirectWithRefreshedCookies(url: URL) {
    const redirectResponse = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  if ((isProtected || isAdminPath) && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return redirectWithRefreshedCookies(redirectUrl);
  }

  if (isAdminPath && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
      return redirectWithRefreshedCookies(new URL("/", request.url));
    }
  }

  return response;
}
