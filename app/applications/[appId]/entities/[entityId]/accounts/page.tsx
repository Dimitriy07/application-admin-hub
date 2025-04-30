import ItemsContainer from "@/app/_components/ItemsContainer";
import {
  DB_COLLECTION_LEVEL3,
  DB_COLLECTION_LEVEL4,
} from "@/app/_constants/mongodb-config";
import { getAccounts } from "@/app/_services/managementDataService";

export default async function Page({
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
  return (
    <ItemsContainer
      items={accounts}
      urlPath={DB_COLLECTION_LEVEL4}
      isSettings={settings}
      managementId={managementId}
      currentCollection={DB_COLLECTION_LEVEL3}
      appId={appId}
      isEdit={edit}
      query={query}
    />
  );
}
