import clientPromise from "../_lib/data/db";

export async function dbConnect(dbName: string, collectionName: string) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return collection;
}
