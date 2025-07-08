import { auth } from "@/auth";
import ProhibitedURLAccess from "./ProhibitedURLAccess";
import {
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
} from "@/app/_constants/mongodb-config";

/**
 * ProtectedComponent
 *
 * This server component restricts access to its children based on the user's role and matching `DB_REFERENCE_TO_COL1` and `DB_REFERENCE_TO_COL2`.
 * It supports two roles:
 * - `superadmin`: unrestricted access
 * - `admin`: access limited to their assigned `DB_REFERENCE_TO_COL1` and `DB_REFERENCE_TO_COL2`
 *
 * If access is denied, it renders the `<ProhibitedURLAccess />` fallback.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if access is allowed.
 * @param {string} props.refIdToCollectionLevel1 - Required for access validation.
 * @param {string} [props.refIdToCollectionLevel2] - Optional entity ID to validate against user session.
 *
 * @returns {Promise<JSX.Element>} Children if access is granted, or a fallback if not.
 */
async function ProtectedComponent({
  children,
  refIdToCollectionLevel1,
  refIdToCollectionLevel2,
}: {
  children: React.ReactNode;
  refIdToCollectionLevel1: string;
  refIdToCollectionLevel2?: string;
}) {
  // Fetch the current user session
  const session = await auth();
  const currentUserRefIdToCollectionLevel1 =
    session?.user?.[DB_REFERENCE_TO_COL1];
  const currentUserRefIdToCollectionLevel2 =
    session?.user?.[DB_REFERENCE_TO_COL2];
  const role = session?.user.role;
  // Only admins with valid app/entity IDs are allowed limited access
  const isValidUser = Boolean(
    currentUserRefIdToCollectionLevel1 &&
      currentUserRefIdToCollectionLevel2 &&
      role === "admin"
  );

  // Superadmins have full unrestricted access
  if (role === "superadmin") return <>{children}</>;

  // If both refIdToCollectionLevel1 and refIdToCollectionLevel2 are required for this view
  if (refIdToCollectionLevel1 && refIdToCollectionLevel2) {
    const hasAccess =
      isValidUser &&
      refIdToCollectionLevel1 === currentUserRefIdToCollectionLevel1 &&
      refIdToCollectionLevel2 === currentUserRefIdToCollectionLevel2;

    return hasAccess ? <>{children}</> : <ProhibitedURLAccess />;
  }

  // If only refIdToCollectionLevel2 is relevant (e.g. scoped to a specific entity)
  if (refIdToCollectionLevel2) {
    const hasAccess =
      isValidUser &&
      refIdToCollectionLevel2 === currentUserRefIdToCollectionLevel2;
    return hasAccess ? <>{children}</> : <ProhibitedURLAccess />;
  }

  // If only refIdToCollectionLevel1 is relevant
  if (refIdToCollectionLevel1) {
    const hasAccess =
      isValidUser &&
      refIdToCollectionLevel1 === currentUserRefIdToCollectionLevel1;
    return hasAccess ? <>{children}</> : <ProhibitedURLAccess />;
  }

  // If no specific restriction logic applies, allow access by default
  return <>{children}</>;
}

export default ProtectedComponent;
