import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ResourcesMessage from "@/app/_components/ResourcesMessage";
import ToolboxBar from "@/app/_components/ToolboxBar";
import { getResourcesByCollection } from "@/app/_services/resourcesDataService";
import settingsRestriction from "@/app/_utils/application1/settings-restriction";

export default async function AppOneResourcePage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    query: string;
    resourceType?: string;
    resourceId: string;
    edit: string;
  }>;
  params: Promise<{ accountId: string; entityId: string; appId: string }>;
}) {
  const { accountId, appId, entityId } = await params;
  const resolvedSearchParams = await searchParams;
  const collectionName = resolvedSearchParams.resourceType;
  const query = resolvedSearchParams.query;

  const resourceId = resolvedSearchParams.resourceId;
  const isEdit = resolvedSearchParams.edit;

  let resourcesArr = [];

  if (collectionName) {
    try {
      const resources = await getResourcesByCollection(
        collectionName,
        accountId
      );
      resourcesArr = resources.map((res) => JSON.parse(JSON.stringify(res)));
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  }
  if (!collectionName) {
    return <ResourcesMessage />;
  }

  //SETTINGS RESTRICTIONS (APPLICATION 1)

  const restrictions = await settingsRestriction(
    entityId,
    collectionName,
    resourcesArr
  );

  if (!restrictions || "message" in restrictions) {
    return <ResourcesMessage message={restrictions?.message} />;
  }

  return (
    <>
      <ProtectedComponent appId={appId} entityId={entityId}>
        <ItemsContainer
          items={resourcesArr}
          resourceId={resourceId}
          collectionName={collectionName}
          appId={appId}
          isEdit={isEdit}
          query={query}
        />
        <ToolboxBar
          isRestricted={restrictions?.isRestricted}
          restrictedMessage={restrictions?.restrictedMessage}
        />
      </ProtectedComponent>
    </>
  );
}

export const fetchCache = "force-no-store";
