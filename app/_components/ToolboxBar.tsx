"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ToolboxContainer from "./ToolboxContainer";
import {
  DB_COLLECTION_LEVEL1,
  DB_COLLECTION_LEVEL2,
} from "@/app/_constants/mongodb-config";

type ToolboxBarProps = {
  /** If true, restricts access to the ToolboxContainer */
  isRestricted?: boolean;
  /** Optional message to show when access is restricted */
  restrictedMessage?: string;
};

/**
 * ToolboxBar Component
 *
 * Conditionally renders a `<ToolboxContainer />` based on:
 * - Current session role (superadmin or admin)
 * - Current page access context
 * - Optional resource query params
 *
 * This ensures that only authorized users can see toolbox functionality.
 *
 * @component
 * @param {ToolboxBarProps} props
 * @returns {JSX.Element | null} The toolbox container or null if access is denied
 */
export default function ToolboxBar({
  isRestricted,
  restrictedMessage,
}: ToolboxBarProps) {
  // Get current path and query parameters
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get user session info
  const { data: session, status } = useSession();

  // Get last part of the pathname to determine current page
  const pageAccess = pathname.split("/").at(-1);

  // Read resourceType and resourceId from query parameters
  const resourceType = searchParams.get("resourceType");
  const resourceId = searchParams.get("resourceId");

  /**
   * Block rendering if user is not authenticated or no session data exists.
   */
  if (status !== "authenticated" || !session?.user) return null;

  const role = session.user.role;

  /**
   * Do not render ToolboxBar in the following cases:
   * - On a resource-app route without a resource type
   * - If a specific resource is already selected
   * - If the page segment cannot be resolved
   */
  if (
    (pageAccess?.startsWith("resources-app") && !resourceType) ||
    resourceId ||
    !pageAccess
  )
    return null;

  /**
   * Permission logic:
   * - Superadmins cannot add documents in level1 collections
   * - Admins cannot add documents in level1 or level2 collections
   */
  const isSuperAdmin =
    role === "superadmin" && pageAccess !== DB_COLLECTION_LEVEL1;

  const isAdmin =
    role === "admin" &&
    pageAccess !== DB_COLLECTION_LEVEL1 &&
    pageAccess !== DB_COLLECTION_LEVEL2;

  // Return null if the user does not meet permission criteria
  if (!isSuperAdmin && !isAdmin) return null;

  // Render ToolboxContainer if permissions and restrictions allow
  return (
    <ToolboxContainer
      isRestricted={isRestricted}
      restrictedMessage={restrictedMessage}
    />
  );
}
