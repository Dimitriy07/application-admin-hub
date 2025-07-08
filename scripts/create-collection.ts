// scripts/create-collection.ts
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { DB_RESOURCES_NAME } from "@/app/_constants/mongodb-config";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not found in .env.local");
}

// Get collection name from CLI argument
const collectionName = process.argv[2];
if (!collectionName) {
  console.error("❌ Please provide a collection name.");
  console.error("   Example: npm run create-collection -- drivers");
  process.exit(1);
}

const createCollection = async () => {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_RESOURCES_NAME);

    const collections = await db
      .listCollections({}, { nameOnly: true })
      .toArray();
    const exists = collections.find((col) => col.name === collectionName);

    if (exists) {
      console.log(
        `⚠️ Collection "${collectionName}" already exists in ${DB_RESOURCES_NAME}`
      );
    } else {
      await db.createCollection(collectionName);
      console.log(
        `✅ Created collection "${collectionName}" in ${DB_RESOURCES_NAME}`
      );
    }
  } catch (err) {
    console.error("❌ Error creating collection:", err);
  } finally {
    await client.close();
  }
};

createCollection();
