import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
// import dotenv from "dotenv";

// dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;
const PASSWORD_PLAIN = "password";

const setup = async () => {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();

    // 1. admin-management > applications
    const managementDb = client.db("admin-management");
    const applications = managementDb.collection("applications");

    const existingApp = await applications.findOne({ name: "Test app" });
    if (!existingApp) {
      await applications.insertOne({ name: "Test app" });
      console.log("✅ Inserted Test app into admin-management.applications");
    } else {
      console.log("⚠️ Test app already exists");
    }

    // 2. admin-resource > users
    const resourceDb = client.db("admin-resource");
    const users = resourceDb.collection("users");

    const existingUser = await users.findOne({ email: "joedow@mtl.com" });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(PASSWORD_PLAIN, 10);
      await users.insertOne({
        name: "Joe Dow",
        email: "joedow@mtl.com",
        password: hashedPassword,
        role: "superadmin",
        emailVerified: { date: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Created SuperAdmin user in admin-resource.users");
    } else {
      console.log("⚠️ SuperAdmin user already exists");
    }

    // 3. admin-authentication > verification-token
    const authDb = client.db("admin-authentication");
    const tokens = authDb.collection("verification-token");

    const count = await tokens.estimatedDocumentCount();
    if (count === 0) {
      await tokens.insertOne({ placeholder: true }); // dummy insert to create collection
      await tokens.deleteMany({ placeholder: true }); // clean up
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
