import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { USERS_COLLECTION } from "@/app/_constants/form-names";
import {
  DB_AUTHENTICATION_NAME,
  DB_COLLECTION_LEVEL1,
  DB_MANAGEMENT_NAME,
  DB_RESOURCES_NAME,
} from "@/app/_constants/mongodb-config";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { appendToAppModules } from "@/app/_utils/append-to-app-modules";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

// Initial configurations
const {
  MONGODB_URI,
  INITIAL_APP_NAME,
  INITIAL_USER_EMAIL,
  INITIAL_USER_NAME,
  INITIAL_USER_PASSWORD,
  INITIAL_APP_ICON,
} = process.env;

if (
  !MONGODB_URI ||
  !INITIAL_APP_NAME ||
  !INITIAL_USER_EMAIL ||
  !INITIAL_USER_NAME ||
  !INITIAL_USER_PASSWORD
) {
  throw new Error("❌ Missing required environment variables in .env.local");
}

const slugify = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const setup = async () => {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    // 1. Insert application in admin-management
    const managementDb = client.db(DB_MANAGEMENT_NAME);
    const levelOneDoc = managementDb.collection(DB_COLLECTION_LEVEL1);

    let insertedAppId;
    const existingApp = await levelOneDoc.findOne({
      name: INITIAL_APP_NAME,
    });

    if (!existingApp) {
      const result = await levelOneDoc.insertOne({
        name: INITIAL_APP_NAME,
        icon: INITIAL_APP_ICON || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      insertedAppId = result.insertedId.toString();
      console.log(
        `✅ Inserted ${INITIAL_APP_NAME} into ${DB_MANAGEMENT_NAME}.${DB_COLLECTION_LEVEL1}`
      );
    } else {
      insertedAppId = existingApp._id.toString();
      console.log(`⚠️ ${INITIAL_APP_NAME} already exists`);
    }

    // 2. Create SuperAdmin in admin-resource
    const resourceDb = client.db(DB_RESOURCES_NAME);
    const users = resourceDb.collection(USERS_COLLECTION);

    const existingUser = await users.findOne({ email: INITIAL_USER_EMAIL });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(INITIAL_USER_PASSWORD, 10);
      await users.insertOne({
        name: INITIAL_USER_NAME,
        email: INITIAL_USER_EMAIL,
        password: hashedPassword,
        role: "superadmin",
        emailVerified: { date: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(
        `✅ Created SuperAdmin user in ${DB_RESOURCES_NAME}.${USERS_COLLECTION}`
      );
    } else {
      console.log(`⚠️ User with ${INITIAL_USER_EMAIL} already exists`);
    }

    // 3. Ensure verification-token collection exists
    const authDb = client.db(DB_AUTHENTICATION_NAME);
    const tokens = authDb.collection("verification-token");

    const count = await tokens.estimatedDocumentCount();
    if (count === 0) {
      await tokens.insertOne({ email: INITIAL_USER_EMAIL });
      await tokens.deleteMany({ email: INITIAL_USER_EMAIL });
      console.log(
        "✅ Created empty collection admin-authentication.verification-token"
      );
    } else {
      console.log(
        "⚠️ Collection verification-token already exists with documents"
      );
    }

    // 4. Create app config folder and files
    const slug = slugify(INITIAL_APP_NAME);
    const configFolder = path.join(process.cwd(), "app/_app-configs", slug);
    fs.mkdirSync(configFolder, { recursive: true });

    // appMeta.ts
    const appMetaContent = `export const appMeta = {
  id: "${insertedAppId}", // your level one management unit Id has to be added
  urlSlug: "-${slug}", // same as app name with dash in the beginning
};
`;
    fs.writeFileSync(path.join(configFolder, "appMeta.ts"), appMetaContent);

    // resourceConfig.ts
    const resourceConfigContent = `export const appResourceFields = {
  // This object configures resource fields for each collection used in the app

  [USERS_COLLECTION]: {
    role: {
      type: "select",
      name: "role",
      id: "role",
      labelName: "User Role",
      options: [
        { value: "", content: "Select Role" },
        { value: "admin", content: "Admin" },
        { value: "user", content: "User" },
      ],
    },
    name: { type: "text", id: "name", name: "name", labelName: "Name" },
    email: { type: "email", id: "email", name: "email", labelName: "Email" },

    conditionalFields: [
      {
        when: { field: "role", value: "user" },
        fields: {
          dob: {
            type: "text",
            id: "dob",
            name: "dob",
            labelName: "Date of Birth",
          },
          drivingLicence: {
            type: "text",
            id: "drivingLicence",
            name: "drivingLicence",
            labelName: "Driving Licence",
          },
        },
      },
      {
        when: { field: "role", value: "admin" },
        fields: {
          password: {
            type: "password",
            id: "password",
            name: "password",
            labelName: "New Password",
          },
        },
      },
    ],
  },

  vehicles: {
    name: { type: "text", id: "name", name: "name", labelName: "Name" },
    make: { type: "text", id: "make", name: "make", labelName: "Make" },
    model: { type: "text", id: "model", name: "model", labelName: "Model" },
    owner: { type: "text", id: "owner", name: "owner", labelName: "Owner" },
  },
} as const;
`;
    fs.writeFileSync(
      path.join(configFolder, "resourceConfig.ts"),
      resourceConfigContent
    );

    // restrictions.ts
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
  ////////Restriction logic
   ////
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

    // settingsConfig.ts
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
    appendToAppModules(slug);
    console.log(`✅ App config files created in: app/_app-configs/${slug}`);
  } catch (err) {
    console.error("❌ Error during setup:", err);
  } finally {
    await client.close();
  }
};

setup();
