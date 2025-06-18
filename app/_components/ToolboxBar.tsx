"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ToolboxContainer from "./ToolboxContainer";
import {
  DB_COLLECTION_LEVEL1,
  DB_COLLECTION_LEVEL2,
} from "@/app/_constants/mongodb-config";

type ToolboxBarProps = {
  isRestricted?: boolean;
  restrictedMessage?: string;
};

export default function ToolboxBar({
  isRestricted,
  restrictedMessage,
}: ToolboxBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const pageAccess = pathname.split("/").at(-1);

  const resourceType = searchParams.get("resourceType");
  const resourceId = searchParams.get("resourceId");

  // take user session to check if the user can manipulate with data (add data)
  if (status !== "authenticated" || !session?.user) return null;

  const role = session.user.role;

  if (
    (pageAccess?.startsWith("resources-app") && !resourceType) ||
    resourceId ||
    !pageAccess
  )
    return null;

  const isSuperAdmin =
    role === "superadmin" && pageAccess !== DB_COLLECTION_LEVEL1;
  const isAdmin =
    role === "admin" &&
    pageAccess !== DB_COLLECTION_LEVEL1 &&
    pageAccess !== DB_COLLECTION_LEVEL2;

  if (!isSuperAdmin && !isAdmin) return null;

  return (
    <ToolboxContainer
      isRestricted={isRestricted}
      restrictedMessage={restrictedMessage}
    />
  );
}
