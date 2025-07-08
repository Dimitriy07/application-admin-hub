import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import {
  DB_COLLECTION_LEVEL1,
  DB_MANAGEMENT_NAME,
} from "@/app/_constants/mongodb-config";

// Load environment variables from .env.local
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not found in .env.local");
}

// Get the app name from the command-line argument
const appName = process.argv[2];
if (!appName) {
  console.error("❌ Please provide the application name. Example:");
  console.error('   npm run create-level-one-unit -- "My New App"');
  process.exit(1);
}

const createApplication = async () => {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(DB_MANAGEMENT_NAME);
    const applications = db.collection(DB_COLLECTION_LEVEL1);

    const exists = await applications.findOne({ name: appName });
    if (exists) {
      console.log(`⚠️ Application "${appName}" already exists`);
      return;
    }

    const result = await applications.insertOne({
      icon: "default-icon.jpeg",
      name: appName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(
      `✅ Application "${appName}" created with ID: ${result.insertedId}`
    );
  } catch (err) {
    console.error("❌ Failed to create application:", err);
  } finally {
    await client.close();
  }
};

createApplication();
