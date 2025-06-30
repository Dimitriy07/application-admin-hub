import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ResourcesMessage from "@/app/_components/ResourcesMessage";
import ToolboxBar from "@/app/_components/ToolboxBar";
import { getResourcesByCollection } from "@/app/_services/data-service/resourcesDataService";
import usersVehiclesRestriction from "@/app/_services/settings/settings-restriction";
import { getResourcesNames } from "@/app/_services/data-service/resourcesDataService";
import urlAndConfigAppSwitcher from "@/app/_services/urlConfigAppSwitcher";
import {
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";

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
  params: Promise<{
    [DB_REFERENCE_TO_COL1]: string;
    [DB_REFERENCE_TO_COL2]: string;
    [DB_REFERENCE_TO_COL3]: string;
  }>;
}) {
  const {
    [DB_REFERENCE_TO_COL1]: refIdToCollectionLevel1,
    [DB_REFERENCE_TO_COL2]: refIdToCollectionLevel2,
    [DB_REFERENCE_TO_COL3]: refIdToCollectionLevel3,
  } = await params;
  const resolvedSearchParams = await searchParams;
  const collectionName = resolvedSearchParams.resourceType;
  const query = resolvedSearchParams.query;

  const resourceId = resolvedSearchParams.resourceId;
  const isEdit = resolvedSearchParams.edit;

  const config = urlAndConfigAppSwitcher(refIdToCollectionLevel1);

  const resourceConfig = config?.resourceConfig;

  if (typeof refIdToCollectionLevel1 !== "string" || !resourceConfig)
    return null;

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
          refIdToCollectionLevel3
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
    refIdToCollectionLevel2,
    collectionName,
    resourcesArr
  );

  if (!restrictions || "message" in restrictions) {
    return <ResourcesMessage message={restrictions?.message} />;
  }
  ///////////////////////////
  return (
    <>
      <ProtectedComponent
        refIdToCollectionLevel1={refIdToCollectionLevel1}
        refIdToCollectionLevel2={refIdToCollectionLevel2}
      >
        <ItemsContainer
          items={resourcesArr}
          resourceId={resourceId}
          collectionName={collectionName}
          refIdToCollectionLevel1={refIdToCollectionLevel1}
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
