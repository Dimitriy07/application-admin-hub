import clientPromise from "@/app/_lib/mongodb";
import { getApplications } from "@/app/_services/applicationService";
import { MongoClient } from "mongodb";

describe("Management DB Service", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await clientPromise;
    const db = client.db("mtl-admin-app");
    console.log("Connected to database:", db.databaseName); // Debugging step

    await db.collection("applications").deleteMany({}); // Ensure collection is empty before inserting

    await db
      .collection("applications")
      .insertMany([{ name: "App 1" }, { name: "App 2" }]);

    const count = await db.collection("applications").countDocuments();
    console.log("Inserted application count:", count); // Should print 2
  });

  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });

  it("should fetch all applications", async () => {
    const apps = await getApplications();
    expect(apps.length).toBe(2);
    expect(apps[0].name).toBe("App 1");
    expect(apps[1].name).toBe("App 2");
  });
});
