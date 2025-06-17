"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ToolboxContainer from "./ToolboxContainer";
import {
  DB_COLLECTION_LEVEL1,
  DB_COLLECTION_LEVEL2,
} from "@/app/_constants/mongodb-config";

export default function ToolboxBar({
  isRestricted,
  restrictedMessage,
}: {
  isRestricted?: boolean;
  restrictedMessage?: string;
}) {
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
  if (
    (pageAccess?.startsWith("resources-app") && !searchResourceType) ||
    searchResourceId
  )
    return null;

  // as superadmin can manipulate with all levels of data return the component
  if (role === "superadmin" && pageAccess !== DB_COLLECTION_LEVEL1) {
    return (
      <ToolboxContainer
        isRestricted={isRestricted}
        restrictedMessage={restrictedMessage}
      />
    );
  }
  // admin can manipulate with data in accounts only
  else if (
    role === "admin" &&
    pageAccess !== DB_COLLECTION_LEVEL1 &&
    pageAccess !== DB_COLLECTION_LEVEL2
  ) {
    return (
      <ToolboxContainer
        isRestricted={isRestricted}
        restrictedMessage={restrictedMessage}
      />
    );
  }
  //user can't manipulate with data
  else return null;
}
