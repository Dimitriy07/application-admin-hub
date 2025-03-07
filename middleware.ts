import { NextRequest } from "next/server";
import { getRequestHeaderUrl } from "./app/middleware/getRequestHeaderUrl";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
// import NextAuth from "next-auth";
// import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(request: NextRequest) {
  //check this
  const session = await auth();

  const isLoginRoute = request.nextUrl.pathname === "/login";
  const isAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");

  if (!session && !isLoginRoute && !isAuthRoute)
    return Response.redirect(new URL("/login", request.nextUrl));

  // if (isLoginRoute) {
  //   if (session) return Response.redirect(new URL("/", request.nextUrl));
  // }

  return getRequestHeaderUrl(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
