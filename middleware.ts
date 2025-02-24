import { NextRequest } from "next/server";
import { getRequestHeaderUrl } from "./app/middleware/getRequestHeaderUrl";

export function middleware(request: NextRequest) {
  return getRequestHeaderUrl(request);
}

export const config = {
  matcher:
    "/applications/:applicationId/entities/:entityId/accounts/:accountId/resources",
};
