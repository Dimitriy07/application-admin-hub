import {
  createManagementInDb,
  deleteManagementDataInDb,
  fetchManagementById,
  fetchManagementDB,
  updateManagementDataInDb,
} from "@/app/_lib/data/management-data";
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

// Get all entities by reference to collection id level 1
export async function getEntities(
  refIdToCollectionLevel1: string,
  refIdToCollectionLevel2: string | null = null
) {
  const getData = fetchManagementDB(
    DB_MANAGEMENT_NAME,
    DB_COLLECTION_LEVEL2,
    DB_REFERENCE_TO_COL1
  );
  return await getData(refIdToCollectionLevel1, refIdToCollectionLevel2);
}

// Get all accounts by reference to collection id level 2
export async function getAccounts(refIdToCollectionLevel2: string) {
  const getData = fetchManagementDB(
    DB_MANAGEMENT_NAME,
    DB_COLLECTION_LEVEL3,
    DB_REFERENCE_TO_COL2
  );
  return await getData(refIdToCollectionLevel2);
}

export async function getManagementDataByManagementId(
  collectionName: string,
  managementId: string
) {
  const getManagementData = fetchManagementById(DB_MANAGEMENT_NAME);
  try {
    const data = await getManagementData(collectionName, managementId);
    return data;
  } catch (err) {
    return {
      error: "Management couldn't be retreived from the database." + err,
    };
  }
}

export async function createManagementItem<T>(
  collectionName: string,
  managementObj: T
) {
  const createItem = await createManagementInDb(
    DB_MANAGEMENT_NAME,
    collectionName
  );
  const createdResourceItem = await createItem(managementObj as T & Document);
  return createdResourceItem;
}

export async function updateManagementItem<T>(
  collectionName: string,
  managementId: string,
  updateObj: T
) {
  try {
    const fetchUpdateData = await updateManagementDataInDb(
      DB_MANAGEMENT_NAME,
      collectionName
    );
    const updatedManagementItem = await fetchUpdateData(
      managementId,
      updateObj as T & Document
    );
    return updatedManagementItem;
  } catch (err) {
    return { error: "Couldn't update Management item: " + err };
  }
}

export async function deleteManagementItem(
  collectionName: string,
  managementId: string,
  referenceToCol?: string
) {
  // try {
  const fetchItem = await deleteManagementDataInDb(
    DB_MANAGEMENT_NAME,
    collectionName,
    referenceToCol
  );
  const deleteResourceItem = await fetchItem(managementId);
  return deleteResourceItem;
  // } catch (err) {
  //   return { error: "Item couldn't be deleted: " + err };
  // }
}
