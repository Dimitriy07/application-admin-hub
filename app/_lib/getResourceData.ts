import clientPromise from "@/app/_lib/mongodb";
import { DynamicResourceItem } from "@/app/_types/types";
import { ObjectId } from "mongodb";

export function getResourceData(
  dbName: string,
  collectionName: string,
  dataId?: string
): (id?: string) => Promise<DynamicResourceItem[]> {
  return async function getDataDocs(
    id?: string
  ): Promise<DynamicResourceItem[]> {
    let _id;
    // Validate and convert the input ID to a MongoDB ObjectId
    if (id) {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid ID: ${id}`);
      }
      _id = new ObjectId(id);
    }

    try {
      // Connect to the MongoDB client
      const client = await clientPromise;
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Fetch documents based on the presence of `id` and `dataId`
      const data =
        id && dataId
          ? await collection.find({ [dataId]: _id }).toArray() // Filter by referenced ID
          : await collection.find({}).toArray(); // Fetch all documents

      // Map the documents to the `Item` type
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
