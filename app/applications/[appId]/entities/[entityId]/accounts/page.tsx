import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ToolboxBar from "@/app/_components/ToolboxBar";
import {
  DB_COLLECTION_LEVEL3,
  DB_COLLECTION_LEVEL4,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";
import { getAccounts } from "@/app/_services/data-service/managementDataService";
import urlAndConfigAppSwitcher from "@/app/_services/urlConfigAppSwitcher";
import { auth } from "@/auth";

export default async function LevelThreePage({
  params,
  searchParams,
}: {
  params: Promise<{ entityId: string; appId: string }>;
  searchParams: Promise<{
    query: string;
    managementId: string;
    settings: string;
    edit: string;
  }>;
}) {
  const session = await auth();
  const { entityId, appId } = await params;
  const accounts = await getAccounts(entityId);
  const { settings, managementId, edit, query } = await searchParams;
  // GET APP NUMBER TO NAVIGATE TO RESOURCES OF DIFFERENT APPS
  const config = urlAndConfigAppSwitcher(appId);
  const urlSlug = config?.urlSlug;

  return (
    <ProtectedComponent appId={appId} entityId={entityId}>
      <ItemsContainer
        userRole={session?.user.role}
        items={accounts}
        urlPath={DB_COLLECTION_LEVEL4 + urlSlug}
        isSettings={settings}
        managementId={managementId}
        currentCollection={DB_COLLECTION_LEVEL3}
        appId={appId}
        isEdit={edit}
        query={query}
        referenceToCol={DB_REFERENCE_TO_COL3}
      />
      <ToolboxBar />
    </ProtectedComponent>
  );
}
