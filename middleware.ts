import { NextRequest } from "next/server";
// import { getRequestHeaderUrl } from "@/app/_middleware/getRequestHeaderUrl";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "@/app/routes";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(request: NextRequest) {
  //check this
  const session = await auth();

  const isAuthRoutes = authRoutes.includes(request.nextUrl.pathname);
  const isApiAuthRoute = request.nextUrl.pathname.startsWith(apiAuthPrefix);

  if (!session && !isAuthRoutes && !isApiAuthRoute)
    return Response.redirect(new URL("/auth/login", request.nextUrl));

  if (isAuthRoutes) {
    if (session)
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
      );
  }

  // return getRequestHeaderUrl(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
