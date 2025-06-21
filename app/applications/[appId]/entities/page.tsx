import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ToolboxBar from "@/app/_components/ToolboxBar";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_REFERENCE_TO_COL2,
} from "@/app/_constants/mongodb-config";
import { getEntities } from "@/app/_services/data-service/managementDataService";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LevelTwoPage({
  params,
  searchParams,
}: {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{
    query: string;
    settings: string;
    managementId: string;
    edit: string;
  }>;
}) {
  const session = await auth();
  const { appId } = await params;
  const { query, settings, managementId, edit } = await searchParams;

  // AUTHENTICATION

  const isSuperAdmin = session?.user.role === "superadmin";
  const hasAccess = isSuperAdmin || session?.user.appId === appId;

  if (!hasAccess) {
    redirect(DEFAULT_LOGIN_REDIRECT);
  }

  const entities = isSuperAdmin
    ? await getEntities(appId)
    : await getEntities(appId, session?.user.entityId);

  return (
    <ProtectedComponent appId={appId}>
      <ItemsContainer
        userRole={session?.user.role}
        items={entities}
        urlPath={DB_COLLECTION_LEVEL3}
        query={query}
        appId={appId}
        currentCollection={DB_COLLECTION_LEVEL2}
        isSettings={settings}
        managementId={managementId}
        isEdit={edit}
        referenceToCol={DB_REFERENCE_TO_COL2}
      />
      <ToolboxBar />
    </ProtectedComponent>
  );
}
