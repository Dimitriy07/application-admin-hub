import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ResourcesMessage from "@/app/_components/ResourcesMessage";
import ToolboxBar from "@/app/_components/ToolboxBar";
import { getResourcesByCollection } from "@/app/_services/data-service/resourcesDataService";
// import usersVehiclesRestriction from "@/app/_app-configs/accident-form/restrictions";
import { getResourcesNames } from "@/app/_services/data-service/resourcesDataService";
import { getAppConfig } from "@/app/_config/getAppConfig";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";
import { getManagementDataByManagementId } from "@/app/_services/data-service/managementDataService";

type SettingsObject = {
  [DB_COLLECTION_LEVEL2]?: Record<string, string> | null;
  [DB_COLLECTION_LEVEL3]?: Record<string, string> | null;
};

export default async function AccidentFormApp({
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
  if (!collectionName) {
    return <ResourcesMessage />;
  }

  const query = resolvedSearchParams.query;

  const resourceId = resolvedSearchParams.resourceId;
  const isEdit = resolvedSearchParams.edit;

  const config = await getAppConfig(refIdToCollectionLevel1);

  if (!config) return null;

  const settingSchema = config?.settings;
  const settingsLevels = Object.keys(settingSchema);

  const settings: SettingsObject = {};
  for (const curLevel of settingsLevels) {
    if (curLevel === DB_COLLECTION_LEVEL2) {
      const managementData = await getManagementDataByManagementId(
        DB_COLLECTION_LEVEL2,
        refIdToCollectionLevel2
      );
      if (!managementData || "error" in managementData) {
        console.error("Error fetching management data or result is null.");
        settings[DB_COLLECTION_LEVEL2] = null;
      } else {
        settings[DB_COLLECTION_LEVEL2] = managementData.settings ?? null;
      }
    } else if (curLevel === DB_COLLECTION_LEVEL3) {
      const managementData = await getManagementDataByManagementId(
        DB_COLLECTION_LEVEL3,
        refIdToCollectionLevel3
      );
      if (!managementData || "error" in managementData) {
        console.error("Error fetching management data or result is null.");
        settings[DB_COLLECTION_LEVEL3] = null;
      } else {
        settings[DB_COLLECTION_LEVEL3] = managementData.settings ?? null;
      }
    } else {
      throw new Error(
        `Invalid settings level: ${curLevel}. Match the settings example in documents`
      );
    }
  }

  const resourceConfig = config?.resourceConfig;

  if (typeof refIdToCollectionLevel1 !== "string" || !resourceConfig)
    return null;

  const validFilterKeySet = new Set(Object.keys(resourceConfig));
  const resourcesNameResult = await getResourcesNames();
  const collectionList = resourcesNameResult.map((col) => col.name);

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

  if (!config.restrictionLogic) return null;

  //SETTINGS RESTRICTIONS FOR APPLICATION
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
