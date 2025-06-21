import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ResourcesMessage from "@/app/_components/ResourcesMessage";
import ToolboxBar from "@/app/_components/ToolboxBar";
import { getResourcesByCollection } from "@/app/_services/data-service/resourcesDataService";
import usersVehiclesRestriction from "@/app/_services/settings/settings-restriction";
import { getResourcesNames } from "@/app/_services/data-service/resourcesDataService";
import urlAndConfigAppSwitcher from "@/app/_services/urlConfigAppSwitcher";

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

  const config = urlAndConfigAppSwitcher(appId);

  const resourceConfig = config?.resourceConfig;

  if (typeof appId !== "string" || !resourceConfig) return null;

  const validFilterKeySet = new Set(Object.keys(resourceConfig));
  const resourcesNameResult = await getResourcesNames();
  const collectionList = resourcesNameResult.map((col) => col.name);

  if (!collectionName) {
    return <ResourcesMessage />;
  }
  const hasAccess =
    validFilterKeySet.has(collectionName) &&
    collectionList.includes(collectionName);

  let resourcesArr = [];

  if (collectionName) {
    if (hasAccess) {
      try {
        const resources = await getResourcesByCollection(
          collectionName,
          accountId
        );
        resourcesArr = resources.map((res) => JSON.parse(JSON.stringify(res)));
      } catch (err) {
        console.error("Failed to fetch resources", err);
      }
    } else {
      return <ResourcesMessage />;
    }
  }

  //SETTINGS RESTRICTIONS (APPLICATION 1)

  const restrictions = await usersVehiclesRestriction(
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
