import {
  DB_REFERENCE_TO_COL3,
  DB_RESOURCES_NAME,
} from "../_constants/mongodb-config";
import {
  fetchResourceById,
  fetchResourcesDB,
  fetchResourcesNames,
} from "../_lib/data/resources-data";

// Fetch all resources by reference ID to Level 3 collection (as Level 3 is the smallest level of management unit (DB_REFERENCE_TO_COL3))

export async function getResourcesByCollection(
  collectionName: string,
  accountId: string
) {
  const getResources = fetchResourcesDB(
    DB_RESOURCES_NAME,
    collectionName,
    DB_REFERENCE_TO_COL3
  );
  const resources = await getResources(accountId);
  return resources;
}

export async function getResourceByResourceId(
  collectionName: string,
  resourceId: string
) {
  const getResource = fetchResourceById(DB_RESOURCES_NAME, collectionName);
  const resource = await getResource(resourceId);
  return resource;
}

export function getResourcesNames() {
  const resourcesName = fetchResourcesNames(DB_RESOURCES_NAME);
  return resourcesName;
}
