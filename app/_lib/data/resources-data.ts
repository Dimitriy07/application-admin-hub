import {
  ObjectId,
  Document,
  InsertOneResult,
  UpdateResult,
  DeleteResult,
} from "mongodb";
import { clientPromise } from "@/app/_lib/data/db";
import { dbConnect } from "@/app/_utils/db-connector";
import { CollectionWithInfo, DynamicResourceItem } from "@/app/_types/types";

/**
 * Factory function that returns a fetcher for dynamic resource documents.
 * Filters by a reference field (e.g., accountId) and excludes superadmin users.
 *
 * @param dbName - Name of the MongoDB database.
 * @param collectionName - Name of the collection to query.
 * @param filterDataId - Name of the field to filter on (e.g., "accountId").
 * @returns A function that accepts an optional document ID and returns a list of resource items.
 */
export function fetchResourcesDB(
  dbName: string,
  collectionName: string,
  filterDataId?: string
): (id?: string) => Promise<DynamicResourceItem[]> {
  return async function fetchDataDocs(
    id?: string
  ): Promise<DynamicResourceItem[]> {
    let objectId;

    if (id) {
      if (!ObjectId.isValid(id)) throw new Error(`Invalid ID: ${id}`);
      objectId = new ObjectId(id);
    }

    if (!filterDataId) throw new Error("No reference to Account provided");

    try {
      const collection = await dbConnect(dbName, collectionName);

      const data = await collection
        .find({ [filterDataId]: objectId, role: { $ne: "superadmin" } })
        .toArray();

      const docsArr = data.map((doc) => {
        const result: DynamicResourceItem = {
          id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
          name: doc.name,
        };
        for (const key in doc) {
          if (key !== "_id") result[key] = doc[key];
        }
        return result;
      });

      return docsArr;
    } catch (error) {
      console.error(`[DB ERROR] Failed to fetch ${collectionName}: `, error);
      throw new Error(`Failed to fetch ${collectionName} from database`);
    }
  };
}

/**
 * Fetch a single resource document by its ObjectId.
 *
 * @param dbName - Name of the MongoDB database.
 * @param collectionName - Collection to query.
 * @returns A function that takes a string ID and returns a resource document or null.
 */
export function fetchResourceById(
  dbName: string,
  collectionName: string
): (id: string) => Promise<DynamicResourceItem | null> {
  return async function fetchResourceDoc(
    id: string
  ): Promise<DynamicResourceItem | null> {
    if (!ObjectId.isValid(id)) throw new Error(`Invalid ID: ${id}`);

    const objectId = new ObjectId(id);
    const collection = await dbConnect(dbName, collectionName);

    const data = await collection.findOne<DynamicResourceItem | null>({
      _id: objectId,
    });
    if (data === undefined) throw new Error(`Resource with ID ${id} not found`);
    return data;
  };
}

/**
 * Retrieves all collection names in the specified database along with their UUIDs.
 *
 * @param dbName - MongoDB database name.
 * @returns An array of objects with collection name and ID (UUID).
 */
export async function fetchResourcesNames(dbName: string) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collections = (await db
    .listCollections()
    .toArray()) as CollectionWithInfo[];

  return collections.map((col) => ({
    name: col.name,
    id: col.info?.uuid?.toString(),
  }));
}

/**
 * Factory function to create a new document in a resource collection.
 * Validates if the collection exists before attempting insertion.
 *
 * @param dbName - MongoDB database name.
 * @param collectionName - Name of the collection to insert into.
 * @returns A function that inserts the provided document into the collection.
 */
export async function createResourceInDb(
  dbName: string,
  collectionName: string
) {
  const collectionList = await fetchResourcesNames(dbName);
  const collectionsName = collectionList.map((col) => col.name);

  if (!collectionsName.includes(collectionName))
    throw new Error(
      `Resource Item can't be created. "${collectionName}" collection doesn't exist in database`
    );

  return async function createResourceDoc<T extends Document>(
    resourceObj: T
  ): Promise<InsertOneResult> {
    const collection = await dbConnect(dbName, collectionName);
    return await collection.insertOne(resourceObj);
  };
}

/**
 * Factory function to update a resource document in the database.
 *
 * @param dbName - MongoDB database name.
 * @param collectionName - Collection name where the resource resides.
 * @returns A function that updates a document by ID with the given fields.
 */
export async function updateResourceInDb(
  dbName: string,
  collectionName: string
) {
  return async function updateResourceDoc<
    T extends Readonly<Partial<Document>>
  >(resourceId: string, updateObj: T): Promise<UpdateResult> {
    const collection = await dbConnect(dbName, collectionName);
    const mongoId = new ObjectId(resourceId);

    return await collection.updateOne(
      { _id: mongoId },
      { $set: { ...updateObj } }
    );
  };
}

/**
 * Factory function to delete a resource document from a MongoDB collection.
 *
 * @param dbName - MongoDB database name.
 * @param collectionName - Collection from which to delete the document.
 * @returns A function that deletes a document by ID and returns the deletion result.
 */
export async function deleteResourceInDb(
  dbName: string,
  collectionName: string
) {
  return async function deleteResourceDoc(
    resourceId: string
  ): Promise<DeleteResult> {
    try {
      const collection = await dbConnect(dbName, collectionName);
      const mongoId = new ObjectId(resourceId);

      return await collection.deleteOne({ _id: mongoId });
    } catch (err) {
      throw new Error("Can not delete doc in db: " + err);
    }
  };
}
