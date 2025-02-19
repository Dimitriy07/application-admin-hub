import clientPromise from "@/app/_lib/mongodb";

import { Item } from "@/app/_types/types";
import { ObjectId } from "mongodb";

// fetch all applications from db
export async function getApplications(): Promise<Item[]> {
  try {
    const client = await clientPromise;
    const db = client.db("mtl-admin-app");
    const collection = db.collection("applications");
    const dataApplications = await collection.find({}).toArray();
    const applications = dataApplications.map((doc) => ({
      id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
      name: doc.name,
      icon: doc.icon,
    }));
    return applications;
  } catch (error) {
    console.error("[DB ERROR] Failed to fetch applications: ", error);
    throw new Error("Failed to fetch applications from database");
  }
}
