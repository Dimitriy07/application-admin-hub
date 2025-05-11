import { NextRequest, NextResponse } from "next/server";
// import { getRequestHeaderUrl } from "@/app/_middleware/getRequestHeaderUrl";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "@/app/routes";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(
  request: NextRequest
): Promise<Response | undefined> {
  //check this
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthRoutes = authRoutes.includes(pathname);
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);

  // Redirect if unauthenticated and trying to access protected route
  if (!session && !isAuthRoutes && !isApiAuthRoute)
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));

  // Redirect authenticated users away from login/register pages
  if (isAuthRoutes) {
    if (session)
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
      );
  }

  const managementUnits = pathname.split("/").filter(Boolean);

  const appName = managementUnits[0];
  const appId = managementUnits[1];
  const entityName = managementUnits[2];
  const entityId = managementUnits[3];

  // const isSuperadmin = session?.user.role === "superadmin";
  // // console.log(session?.user);
  // if (appName === "applications" && appId) {
  //   if (!isSuperadmin && appId !== session?.user.appId) {
  //     return NextResponse.redirect(
  //       new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
  //     );
  //   }
  //   return NextResponse.next();
  // }

  // if (entityName === "applications" && entityId) {
  //   if (!isSuperadmin && entityId !== session?.user.entityId) {
  //     return NextResponse.redirect(
  //       new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
  //     );
  //   }
  //   return NextResponse.next();
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
