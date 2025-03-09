import { Item } from "@/app/_types/types";
import { ObjectId } from "mongodb";
import { dbConnect } from "../../_utils/db-connector";

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
  dataFilterId?: string
): (id?: string) => Promise<Item[]> {
  return async function fetchDataDocs(id?: string): Promise<Item[]> {
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

      // Fetch documents based on the presence of `id` and `dataFilterId`
      const data =
        id && dataFilterId
          ? await collection.find({ [dataFilterId]: objectId }).toArray() // Filter by referenced ID
          : await collection.find({}).toArray(); // Fetch all documents

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
