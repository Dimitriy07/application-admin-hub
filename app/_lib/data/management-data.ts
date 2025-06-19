import { Item } from "@/app/_types/types";
import { ObjectId } from "mongodb";
import { dbConnect } from "../../_utils/db-connector";
import { flattenObject } from "@/app/_utils/flatten-objects";
import { DB_RESOURCES_NAME } from "@/app/_constants/mongodb-config";
import { USERS_COLLECTION } from "@/app/_constants/form-names";

/**
 * Creates a reusable function to fetch data from a MongoDB collection.
 *
 * This function is designed to fetch documents from a specified collection in a MongoDB database.
 * It can filter documents by a referenced ID (`dataId`) if provided, or fetch all documents if no ID is provided.
 * The returned objects include mandatory fields (`id` and `name`) and optional fields (`icon`, `password`, `settings`).
 *
 * @param {string} dbName - The name of the database to query.
 * @param {string} collectionName - The name of the collection to query.
 * @param {string} [dataId] - Optional. The field name in the collection that references the parent document's ID (e.g., `entityId`, `applicationId`).
 * @returns {(id?: string) => Promise<Item[]>} A function that takes an optional `id` and returns a promise resolving to an array of `Item` objects.
 *
 * @example
 * // Create a function to fetch all entities
 * const getAllEntities = getManagementData("mtl-admin-app", "entities");
 * const entities = await getAllEntities();
 * console.log(entities);
 *
 * @example
 * // Create a function to fetch entities by applicationId
 * const getEntitiesByApplicationId = getManagementData("mtl-admin-app", "entities", "applicationId");
 * const entities = await getEntitiesByApplicationId("64f8e4a7e4b0d0a8f0e4a7b2");
 * console.log(entities);
 */
export function fetchManagementDB(
  dbName: string,
  collectionName: string,
  collectionRefName?: string
): (
  collectionRefId?: string,
  filterCurrentCollectionId?: string | null
) => Promise<Item[]> {
  return async function fetchManagementDocs(
    collectionRefId?: string,
    filterCurrentCollectionId?: string | null
  ): Promise<Item[]> {
    let refId;
    let currentRefId;
    // Validate and convert the input ID to a MongoDB ObjectId
    if (collectionRefId) {
      if (!ObjectId.isValid(collectionRefId)) {
        throw new Error(`Invalid ID: ${collectionRefId}`);
      }
      refId = new ObjectId(collectionRefId);
    }
    if (filterCurrentCollectionId) {
      if (!ObjectId.isValid(filterCurrentCollectionId)) {
        throw new Error(`Invalid filtered ID: ${filterCurrentCollectionId}`);
      }
      currentRefId = new ObjectId(filterCurrentCollectionId);
    }

    try {
      // Connect to the MongoDB client
      const collection = await dbConnect(dbName, collectionName);

      // Fetch documents based on the presence of `id` and `collectionRefId`
      let data;
      // Filter by referenced ID
      if (refId && collectionRefName) {
        if (currentRefId) {
          data = await collection
            .find({
              [collectionRefName]: refId,
              _id: currentRefId,
            })
            .toArray();
        } else {
          data = await collection
            .find({ [collectionRefName]: refId })
            .toArray();
        }
      }
      // Fetch all documents
      else {
        data = await collection.find({}).toArray();
      }

      // Map the documents to the `Item` type
      const docsArr = data.map((doc) => ({
        id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id, // Convert ObjectId to string
        name: doc.name, // Mandatory field
        ...(doc.icon && { icon: doc.icon }), // Optional field
        ...(doc.password && { password: doc.password }), // Optional field
        ...(doc.settings && { settings: doc.settings }), // Optional field
      }));

      return docsArr;
    } catch (error) {
      // Log and rethrow the error with a descriptive message
      console.error(`[DB ERROR] Failed to fetch ${collectionName}: `, error);
      throw new Error(`Failed to fetch ${collectionName} from database`);
    }
  };
}

export function fetchManagementById(dbName: string) {
  return async function fetchManagementDocById(
    collectionName: string,
    managementId: string
  ) {
    const id = new ObjectId(managementId);
    try {
      const collection = await dbConnect(dbName, collectionName);
      const data = await collection.findOne({ _id: id });
      return data;
    } catch (err) {
      throw new Error("Management data wasn't fetched." + err);
    }
  };
}

export async function createManagementInDb(
  dbName: string,
  collectionName: string
) {
  return async function createManagementDoc<T extends Document>(
    managementObj: T
  ) {
    try {
      const collection = await dbConnect(dbName, collectionName);
      const data = await collection.insertOne(managementObj);
      return data;
    } catch (err) {
      throw new Error("Couldn't create Management Item. " + err);
    }
  };
}

export async function updateManagementDataInDb(
  dbName: string,
  collectionName: string
) {
  return async function updateManagementDoc<
    T extends Readonly<Partial<Document>>
  >(managementId: string, updateObj: T) {
    try {
      const collection = await dbConnect(dbName, collectionName);
      const mongoId = new ObjectId(managementId);
      const flatUpdate = flattenObject(updateObj);
      const data = await collection.updateOne(
        { _id: mongoId },
        { $set: flatUpdate }
      );
      return data;
    } catch (err) {
      throw new Error("Update management item error: " + err);
    }
  };
}

export async function deleteManagementDataInDb(
  dbName: string,
  collectionName: string,
  referenceToCol?: string
) {
  return async function deleteResourceDoc(managementId: string) {
    // try {
    let collection;
    let hasUser;
    const mongoId = new ObjectId(managementId);
    if (referenceToCol) {
      collection = await dbConnect(DB_RESOURCES_NAME, USERS_COLLECTION);
      hasUser = await collection.findOne({
        [referenceToCol]: mongoId,
      });
    }
    if (hasUser) {
      return {
        error: "There is at least one user connected to the collection.",
      };
    } else {
      collection = await dbConnect(dbName, collectionName);

      const result = await collection.deleteOne({ _id: mongoId });
      return result.acknowledged === true && result.deletedCount > 0
        ? { success: true, message: "The item has been deleted." }
        : { error: " The item hasn't been deleted" };
    }
    // } catch (err) {
    //   throw new Error("Can not delete doc in db: " + err);
    // }
  };
}
