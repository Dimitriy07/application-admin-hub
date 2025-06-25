import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import { USERS_COLLECTION } from "@/app/_constants/form-names";
import {
  DB_AUTHENTICATION_NAME,
  DB_COLLECTION_LEVEL1,
  DB_MANAGEMENT_NAME,
  DB_RESOURCES_NAME,
} from "@/app/_constants/mongodb-config";

//////*****  Initial configurations for the application  ****/////

/// App Configurations
const APP_NAME = "Test app";

//// Superadmin User Configurations

const USER_EMAIL = "joedow@mtl.com";
const USER_NAME = "Joe Dow";
const PASSWORD_PLAIN = "password";

const setup = async () => {
  const client = new MongoClient(process.env.MONGO_URI!);

  try {
    await client.connect();

    // 1. admin-management > applications
    const managementDb = client.db(DB_MANAGEMENT_NAME);
    const applications = managementDb.collection(DB_COLLECTION_LEVEL1);

    const existingApp = await applications.findOne({ name: APP_NAME });
    if (!existingApp) {
      await applications.insertOne({ name: APP_NAME });
      console.log(`✅ Inserted ${APP_NAME} into admin-management.applications`);
    } else {
      console.log(`⚠️ ${APP_NAME} already exists`);
    }

    // 2. admin-resource > users
    const resourceDb = client.db(DB_RESOURCES_NAME);
    const users = resourceDb.collection(USERS_COLLECTION);

    const existingUser = await users.findOne({ email: USER_EMAIL });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(PASSWORD_PLAIN, 10);
      await users.insertOne({
        name: USER_NAME,
        email: USER_EMAIL,
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
      console.log(`⚠️ User with ${USER_EMAIL} email already exists`);
    }

    // 3. admin-authentication > verification-token
    const authDb = client.db(DB_AUTHENTICATION_NAME);
    const tokens = authDb.collection("verification-token");

    const count = await tokens.estimatedDocumentCount();
    if (count === 0) {
      await tokens.insertOne({ email: USER_EMAIL });
      await tokens.deleteMany({ email: USER_EMAIL });
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
