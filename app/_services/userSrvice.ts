import clientPromise from "@/app/_lib/mongodb";

import { Item } from "@/app/_types/types";
import { ObjectId } from "mongodb";

export async function getEntities(id: string): Promise<Item[]> {
  // Convert id props to MongoDB ObjectId
  const _id = new ObjectId(id);
  try {
    const client = await clientPromise;
    const db = client.db("mtl-admin-app");
    const collection = db.collection("entities");
    const dataEntities = await collection
      .find({ applicationId: { $eq: _id } })
      .toArray();
    const entities = dataEntities.map((doc) => ({
      id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
      name: doc.name,
      icon: doc.icon,
    }));
    return entities;
  } catch (error) {
    console.error("[DB ERROR] Failed to fetch entities: ", error);
    throw new Error("Failed to fetch entities from database");
  }
}
