import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ToolboxBar from "@/app/_components/ToolboxBar";
import {
  DB_COLLECTION_LEVEL3,
  DB_COLLECTION_LEVEL4,
} from "@/app/_constants/mongodb-config";
import { getAccounts } from "@/app/_services/managementDataService";
import urlAppSwitcher from "@/app/_utils/url-app-switcher";

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
  const { entityId, appId } = await params;
  const accounts = await getAccounts(entityId);
  const { settings, managementId, edit, query } = await searchParams;
  // GET APP NUMBER TO NAVIGATE TO RESOURCES OF DIFFERENT APPS
  const appNumber = urlAppSwitcher(appId);

  return (
    <ProtectedComponent appId={appId} entityId={entityId}>
      <ItemsContainer
        items={accounts}
        urlPath={DB_COLLECTION_LEVEL4 + appNumber}
        isSettings={settings}
        managementId={managementId}
        currentCollection={DB_COLLECTION_LEVEL3}
        appId={appId}
        isEdit={edit}
        query={query}
      />
      <ToolboxBar />
    </ProtectedComponent>
  );
}
