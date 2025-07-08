import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ResourcesMessage from "@/app/_components/ResourcesMessage";
import ToolboxBar from "@/app/_components/ToolboxBar";
import { getResourcesByCollection } from "@/app/_services/data-service/resourcesDataService";
import { getResourcesNames } from "@/app/_services/data-service/resourcesDataService";
import { getAppConfig } from "@/app/_config/getAppConfig";
import {
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";
import { getSettings } from "@/app/_config/getSettings";

export default async function ResourcePage({
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

  const {
    query,
    resourceId,
    edit: isEdit,
    resourceType: collectionName,
  } = resolvedSearchParams;

  if (!collectionName) {
    return (
      <ResourcesMessage message="← Choose the Resource from the side bar" />
    );
  }

  const config = await getAppConfig(refIdToCollectionLevel1);

  if (!config) return console.error("App configs haven't been found");

  const settings = await getSettings(
    config,
    refIdToCollectionLevel2,
    refIdToCollectionLevel3
  );

  const resourceConfig = config?.resourceConfig;

  if (!resourceConfig)
    return console.error("Resource configs haven't been found");

  // GET LIST OF RESOURCE COLLECTIONS FROM RESOURCE CONFIG FILES TO MATCH IT FROM CORRESPONDING RESOURCES FROM DATABASE (TO PREVENT ACCESS TO UNAUTHORISED COLLECTIONS)
  const validResourceConfigSet = new Set(Object.keys(resourceConfig));
  const resourcesNameResult = await getResourcesNames();
  const collectionList = resourcesNameResult.map((col) => col.name);

  const hasAccess =
    validResourceConfigSet.has(collectionName) &&
    collectionList.includes(collectionName);

  let resourcesArr = [];

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
    return (
      <ResourcesMessage message="← Choose the Resource from the side bar" />
    );
  }

  //SETTINGS RESTRICTIONS FOR APPLICATION
  if (!config.restrictionLogic)
    return console.error("Restriction configs haven't been found");

  const restrictions = config?.restrictionLogic({
    collectionName,
    settings,
    resourcesArr,
  });

  if (!restrictions || "message" in restrictions) {
    return (
      <ResourcesMessage
        message={
          restrictions?.message || "There is an issue with restriction settings"
        }
      />
    );
  }

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
