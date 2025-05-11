import { auth } from "@/auth";
import ProhibitedURLAccess from "./ProhibitedURLAccess";

async function ProtectedComponent({
  children,
  entityId,
  appId,
}: {
  children: React.ReactNode;
  entityId?: string;
  appId: string;
}) {
  const session = await auth();
  const currentUserEntityId = session?.user?.entityId;
  const currentUserAppId = session?.user?.appId;
  const role = session?.user.role;

  const isValidUser = Boolean(
    currentUserAppId && currentUserEntityId && role === "admin"
  );

  if (role === "superadmin") return <>{children}</>;
  if (appId && entityId) {
    if (
      isValidUser &&
      appId === currentUserAppId &&
      entityId === currentUserEntityId
    ) {
      return <>{children}</>;
    } else {
      return <ProhibitedURLAccess />;
    }
  }
  if (entityId) {
    console.log(entityId === currentUserEntityId);
    if (isValidUser && entityId === currentUserEntityId) {
      return <>{children}</>;
    } else {
      return <ProhibitedURLAccess />;
    }
  }
  if (appId) {
    if (isValidUser && appId === currentUserAppId) {
      return <>{children}</>;
    } else {
      return <ProhibitedURLAccess />;
    }
  }

  return <>{children}</>;
}

export default ProtectedComponent;
