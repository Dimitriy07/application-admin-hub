import { getResourcesData } from "@/app/_lib/resource-data";
import { DB_RESOURCES_NAME } from "../_constants/mongodb-config";

// fetch all applications from db

export async function getResources(collectionName: string) {
  const getResourcesByAccountId = getResourcesData(
    DB_RESOURCES_NAME,
    collectionName,
    "accountId"
  );
  const resource = await getResourcesByAccountId();
  return resource;
}

export async function getResource(collectionName: string) {
  const getResourcesByAccountId = getResourceData(
    DB_RESOURCES_NAME,
    collectionName,
    "accountId"
  );
  const resource = await getResourcesByAccountId();
  return resource;
}
