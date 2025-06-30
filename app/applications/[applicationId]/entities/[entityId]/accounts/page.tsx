import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ToolboxBar from "@/app/_components/ToolboxBar";
import {
  DB_COLLECTION_LEVEL3,
  DB_COLLECTION_RESOURCE,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";
import { getAccounts } from "@/app/_services/data-service/managementDataService";
import urlAndConfigAppSwitcher from "@/app/_services/urlConfigAppSwitcher";
import { auth } from "@/auth";

export default async function LevelThreePage({
  params,
  searchParams,
}: {
  params: Promise<{
    [DB_REFERENCE_TO_COL1]: string;
    [DB_REFERENCE_TO_COL2]: string;
  }>;
  searchParams: Promise<{
    query: string;
    managementId: string;
    settings: string;
    edit: string;
  }>;
}) {
  const session = await auth();
  const {
    [DB_REFERENCE_TO_COL1]: refIdToCollectionLevel1,
    [DB_REFERENCE_TO_COL2]: refIdToCollectionLevel2,
  } = await params;
  const accounts = await getAccounts(refIdToCollectionLevel2);
  const { settings, managementId, edit, query } = await searchParams;
  // GET APP NUMBER TO NAVIGATE TO RESOURCES OF DIFFERENT APPS
  const config = urlAndConfigAppSwitcher(refIdToCollectionLevel1);
  const urlSlug = config?.urlSlug;

  return (
    <ProtectedComponent
      refIdToCollectionLevel1={refIdToCollectionLevel1}
      refIdToCollectionLevel2={refIdToCollectionLevel2}
    >
      <ItemsContainer
        userRole={session?.user.role}
        items={accounts}
        urlPath={DB_COLLECTION_RESOURCE + urlSlug}
        isSettings={settings}
        managementId={managementId}
        currentCollection={DB_COLLECTION_LEVEL3}
        refIdToCollectionLevel1={refIdToCollectionLevel1}
        isEdit={edit}
        query={query}
        refNameToCollection={DB_REFERENCE_TO_COL3}
      />
      <ToolboxBar />
    </ProtectedComponent>
  );
}
