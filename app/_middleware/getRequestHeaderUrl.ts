import { NextRequest, NextResponse } from "next/server";

export function getRequestHeaderUrl(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-full-url", request.nextUrl.toString());

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
