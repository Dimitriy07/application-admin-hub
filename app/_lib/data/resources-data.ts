import clientPromise from "@/app/_lib/data/db";
import { CollectionWithInfo, DynamicResourceItem } from "@/app/_types/types";
import { ObjectId } from "mongodb";
import { dbConnect } from "../../_utils/db-connector";

export function fetchResourcesDB(
  dbName: string,
  collectionName: string,
  filterDataId?: string
): (id?: string) => Promise<DynamicResourceItem[]> {
  return async function fetchDataDocs(
    id?: string
  ): Promise<DynamicResourceItem[]> {
    let objectId;
    // Validate and convert the input ID to a MongoDB ObjectId
    if (id) {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ID: ${id}`);
      }
      objectId = new ObjectId(id);
    }

    try {
      // Connect to the MongoDB client
      const collection = await dbConnect(dbName, collectionName);

      if (!filterDataId) throw new Error("No reference to Account provided");
      const data = await collection
        .find({ [filterDataId]: objectId })
        .toArray();

      // Map the documents to the `DynamicResourceItem` type
      const docsArr = data.map((doc) => {
        const result: DynamicResourceItem = {
          id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
          name: doc.name,
        };
        for (const key in doc) {
          if (key !== "_id") {
            result[key] = doc[key];
          }
        }
        return result;
      });

      return docsArr;
    } catch (error) {
      // Log and rethrow the error with a descriptive message
      console.error(`[DB ERROR] Failed to fetch ${collectionName}: `, error);
      throw new Error(`Failed to fetch ${collectionName} from database`);
    }
  };
}

export function fetchResourceById(
  dbName: string,
  collectionName: string
): (id: string) => Promise<DynamicResourceItem | null> {
  return async function fetchResourceDoc(
    id: string
  ): Promise<DynamicResourceItem | null> {
    let objectId;
    if (id) {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ID: ${id}`);
      }
      objectId = new ObjectId(id);
    } else {
      throw new Error("No ID provided");
    }
    const collection = await dbConnect(dbName, collectionName);
    const data = await collection.findOne<DynamicResourceItem | null>({
      _id: objectId,
    });
    if (data === undefined) throw new Error(`Resource with ID ${id} not found`);
    return data;
  };
}

export async function fetchResourcesNames(dbName: string) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collections = (await db
    .listCollections()
    .toArray()) as CollectionWithInfo[];
  return collections.map((col) => {
    return { name: col.name, id: col.info?.uuid?.toString() };
  });
}

export async function createResourceInDb(
  dbName: string,
  collectionName: string
) {
  return async function createResourceDoc<T extends Document>(resourceObj: T) {
    const collection = await dbConnect(dbName, collectionName);
    const data = await collection.insertOne(resourceObj);
    return data;
  };
}

export async function updateResourceInDb(
  dbName: string,
  collectionName: string
) {
  return async function updateResourceDoc<
    T extends Readonly<Partial<Document>>
  >(resourceId: string, updateObj: T) {
    const collection = await dbConnect(dbName, collectionName);
    const mongoId = new ObjectId(resourceId);
    const data = await collection.updateOne(
      { _id: mongoId },
      { $set: { ...updateObj } }
    );
    return data;
  };
}

export async function deleteResourceInDb(
  dbName: string,
  collectionName: string
) {
  return async function deleteResourceDoc(resourceId: string) {
    try {
      const collection = await dbConnect(dbName, collectionName);
      const mongoId = new ObjectId(resourceId);
      const data = await collection.deleteOne({ _id: mongoId });
      return data;
    } catch (err) {
      throw new Error("Can not delete doc in db: " + err);
    }
  };
}
