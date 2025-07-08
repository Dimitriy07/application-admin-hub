import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { MongoClient } from "mongodb";
import {
  DB_COLLECTION_LEVEL1,
  DB_MANAGEMENT_NAME,
} from "@/app/_constants/mongodb-config";

// Load environment
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("❌ MONGODB_URI missing in .env.local");

const appName = process.argv[2];
if (!appName) {
  console.error(
    `❌ Please provide an level one unit name:\n   npm run create-level-one-unit -- \"My App\"`
  );
  process.exit(1);
}

const slugify = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const createLevelOneUnit = async () => {
  const client = new MongoClient(MONGODB_URI);
  const slug = slugify(appName);

  try {
    await client.connect();
    const db = client.db(DB_MANAGEMENT_NAME);
    const levelOneCollection = db.collection(DB_COLLECTION_LEVEL1);

    const exists = await levelOneCollection.findOne({ name: appName });
    if (exists) {
      console.log(`⚠️ Level one "${appName}" already exists`);
      return;
    }

    const result = await levelOneCollection.insertOne({
      icon: "/default-icon.jpeg",
      name: appName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const refIdToCollectionLevel1 = result.insertedId.toString();
    console.log(
      `✅ Application "${appName}" created with ID: ${refIdToCollectionLevel1}`
    );

    // ─── Create config folder ───────────────────────────────────────────────
    const configFolder = path.join(process.cwd(), "app/_app-configs", slug);
    fs.mkdirSync(configFolder, { recursive: true });

    // 1. appMeta.ts
    const appMetaContent = `export const appMeta = {
  id: "${refIdToCollectionLevel1}", // your level one management unit Id
  urlSlug: "-${slug}", // same as app name with dash in the beginning
};
`;
    fs.writeFileSync(path.join(configFolder, "appMeta.ts"), appMetaContent);

    // 2. resourceConfig.ts
    const resourceConfigContent = `export const appResourceFields = {
  // This object configures resource fields for each collection used in the app

  // [USERS_COLLECTION]: {
  //   name: { type: "text", id: "name", name: "name", labelName: "Name" },
  //   email: { type: "email", id: "email", name: "email", labelName: "Email" },
  // },

  // [VEHICLES_COLLECTION]: {
  //   name: { type: "text", id: "name", name: "name", labelName: "Name" },
  //   owner: { type: "text", id: "owner", name: "owner", labelName: "Owner" },
  // },
} as const;
`;
    fs.writeFileSync(
      path.join(configFolder, "resourceConfig.ts"),
      resourceConfigContent
    );

    // 3. restrictions.ts
    const restrictionsContent = `/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RestrictionLogicFn } from "@/app/_types/types";

// This function can take:
// - collectionName: the resource collection name under restriction
// - settings: the settings object for the current level
// - resourcesArr: the array of resources in the collection
// Returns: { isRestricted: boolean, restrictedMessage?: string }

export const restrictionLogic: RestrictionLogicFn = ({
  collectionName,
  settings,
  resourcesArr,
}) => {
 /***** Restriction logic
  * 
  * ////
  const isRestricted = false;
  return {
    isRestricted,
    // restrictedMessage: "Restriction applies due to some rule",
  };
};
`;
    fs.writeFileSync(
      path.join(configFolder, "restrictions.ts"),
      restrictionsContent
    );

    // 4. settingsConfig.ts
    const settingsConfigContent = `export const appSettingsFields = {
  // This is the schema of settings and what level they apply to
  // Example for DB_COLLECTION_LEVEL2 (e.g. Account level)

  // [DB_COLLECTION_LEVEL2]: {
  //   accountType: {
  //     type: "select",
  //     name: "accountType",
  //     id: "accountType",
  //     labelName: "Account Type",
  //     options: [
  //       { value: "", content: "Select account type" },
  //       { value: "fleet", content: "Fleet" },
  //       { value: "personal", content: "Personal account" },
  //     ],
  //   },
  //   maxUsers: {
  //     type: "number",
  //     id: "maxUsers",
  //     name: "maxUsers",
  //     labelName: "Maximum Users",
  //     min: 1,
  //   },
  //   maxVehicles: {
  //     type: "number",
  //     id: "maxVehicles",
  //     name: "maxVehicles",
  //     labelName: "Maximum Vehicles",
  //     min: 1,
  //   },
  // },
} as const;
`;
    fs.writeFileSync(
      path.join(configFolder, "settingsConfig.ts"),
      settingsConfigContent
    );

    console.log(
      `✅ Config folder and files created at: app/_app-configs/${slug}`
    );
  } catch (err) {
    console.error("❌ Failed to create application:", err);
  } finally {
    await client.close();
  }
};

createLevelOneUnit();
