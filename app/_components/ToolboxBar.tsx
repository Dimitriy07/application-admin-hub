"use client";
// import { auth } from "@/auth";
// import { headers } from "next/headers";
import { PropsWithChildren } from "react";
import {
  DB_COLLECTION_LEVEL1,
  DB_COLLECTION_LEVEL2,
} from "@/app/_constants/mongodb-config";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ToolboxBar({ children }: PropsWithChildren) {
  const path = usePathname();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const searchResourceType = searchParams.get("resourceType");
  const searchResourceId = searchParams.get("resourceId");

  // take user session to check if the user can manipulate with data (add data)
  if (status === "loading") return null;
  if (status === "unauthenticated" || !session?.user) return null;
  const pageAccess = path.split("/").at(-1);
  const role = session.user.role;
  if ((pageAccess === "resources" && !searchResourceType) || searchResourceId)
    return null;
  // as superadmin can manipulate with all levels of data return the component
  if (role === "superadmin" && pageAccess !== DB_COLLECTION_LEVEL1) {
    return (
      <div className="h-10 flex justify-between items-center border">
        {children}
      </div>
    );
  }
  // admin can manipulate with data in entities only
  else if (
    role === "admin" &&
    pageAccess !== DB_COLLECTION_LEVEL1 &&
    pageAccess !== DB_COLLECTION_LEVEL2
  ) {
    return (
      <div className="h-10 flex justify-between items-center border">
        {children}
      </div>
    );
  }
  //user can't manipulate with data
  else return null;
}
