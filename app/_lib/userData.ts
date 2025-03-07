import clientPromise from "./db";

export function fetchUserFromDb(dbName: string, collectionName: string) {
  return async function fetchUserDoc(email: string) {
    if (!email) throw new Error("No email provided");

    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.findOne({
      email: email,
    });
    if (data === undefined)
      throw new Error(`User with email ${email} not found`);
    return data;
  };
}
