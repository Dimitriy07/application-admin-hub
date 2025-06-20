import { auth } from "@/auth";
import ProhibitedURLAccess from "./ProhibitedURLAccess";

/**
 * ProtectedComponent
 *
 * This server component restricts access to its children based on the user's role and matching `appId` and `entityId`.
 * It supports two roles:
 * - `superadmin`: unrestricted access
 * - `admin`: access limited to their assigned `appId` and `entityId`
 *
 * If access is denied, it renders the `<ProhibitedURLAccess />` fallback.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if access is allowed.
 * @param {string} props.appId - Required for access validation.
 * @param {string} [props.entityId] - Optional entity ID to validate against user session.
 *
 * @returns {Promise<JSX.Element>} Children if access is granted, or a fallback if not.
 */
async function ProtectedComponent({
  children,
  entityId,
  appId,
}: {
  children: React.ReactNode;
  entityId?: string;
  appId: string;
}) {
  // Fetch the current user session
  const session = await auth();
  const currentUserEntityId = session?.user?.entityId;
  const currentUserAppId = session?.user?.appId;
  const role = session?.user.role;

  // Only admins with valid app/entity IDs are allowed limited access
  const isValidUser = Boolean(
    currentUserAppId && currentUserEntityId && role === "admin"
  );

  // Superadmins have full unrestricted access
  if (role === "superadmin") return <>{children}</>;

  // If both appId and entityId are required for this view
  if (appId && entityId) {
    const hasAccess =
      isValidUser &&
      appId === currentUserAppId &&
      entityId === currentUserEntityId;

    return hasAccess ? <>{children}</> : <ProhibitedURLAccess />;
  }

  // If only entityId is relevant (e.g. scoped to a specific entity)
  if (entityId) {
    const hasAccess = isValidUser && entityId === currentUserEntityId;
    return hasAccess ? <>{children}</> : <ProhibitedURLAccess />;
  }

  // If only appId is relevant
  if (appId) {
    const hasAccess = isValidUser && appId === currentUserAppId;
    return hasAccess ? <>{children}</> : <ProhibitedURLAccess />;
  }

  // If no specific restriction logic applies, allow access by default
  return <>{children}</>;
}

export default ProtectedComponent;
