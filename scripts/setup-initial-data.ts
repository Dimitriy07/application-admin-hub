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

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});
//////*****  Initial configurations for the application  ****/////

// Get config from environment
const {
  MONGODB_URI,
  INITIAL_APP_NAME,
  INITIAL_USER_EMAIL,
  INITIAL_USER_NAME,
  INITIAL_USER_PASSWORD,
  INITIAL_APP_ICON,
} = process.env;

// Basic validation
if (
  !MONGODB_URI ||
  !INITIAL_APP_NAME ||
  !INITIAL_USER_EMAIL ||
  !INITIAL_USER_NAME ||
  !INITIAL_USER_PASSWORD
) {
  throw new Error("❌ Missing required environment variables in .env.local");
}

const setup = async () => {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    // 1. admin-management > applications
    const managementDb = client.db(DB_MANAGEMENT_NAME);
    const levelOneDoc = managementDb.collection(DB_COLLECTION_LEVEL1);

    const existingApp = await levelOneDoc.findOne({
      name: INITIAL_APP_NAME,
      icon: INITIAL_APP_ICON,
    });
    if (!existingApp) {
      await levelOneDoc.insertOne({ name: INITIAL_APP_NAME });
      console.log(
        `✅ Inserted ${INITIAL_APP_NAME} into ${DB_MANAGEMENT_NAME}.${DB_COLLECTION_LEVEL1}`
      );
    } else {
      console.log(`⚠️ ${INITIAL_APP_NAME} already exists`);
    }

    // 2. admin-resource > users
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
      console.log(`⚠️ User with ${INITIAL_USER_EMAIL} email already exists`);
    }

    // 3. admin-authentication > verification-token
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
  } catch (err) {
    console.error("❌ Error during setup:", err);
  } finally {
    await client.close();
  }
};

setup();
