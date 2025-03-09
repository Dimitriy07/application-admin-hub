import { fetchManagementDB } from "@/app/_lib/data/management-data";
import {
  DB_COLLECTION_LEVEL1,
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_MANAGEMENT_NAME,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
} from "@/app/_constants/mongodb-config";

// DB_COLLECTION_LEVEL - ex. applications(Level 1) -> entities(Level 2) -> accounts(Level 3)
// DB_REFERENCE_TO_COL - reference to the id document in the certain level (ex. DB_REFERENCE_TO_COL1 - all data which has applicationId reference)

// Get all applications
export async function getApplications() {
  const getData = fetchManagementDB(DB_MANAGEMENT_NAME, DB_COLLECTION_LEVEL1);
  return await getData();
}

// Get all entities by applicationId
export async function getEntities(applicationId: string) {
  const getData = fetchManagementDB(
    DB_MANAGEMENT_NAME,
    DB_COLLECTION_LEVEL2,
    DB_REFERENCE_TO_COL1
  );
  return await getData(applicationId);
}

// Get all accounts by entityId
export async function getAccounts(entityId: string) {
  const getData = fetchManagementDB(
    DB_MANAGEMENT_NAME,
    DB_COLLECTION_LEVEL3,
    DB_REFERENCE_TO_COL2
  );
  return await getData(entityId);
}
