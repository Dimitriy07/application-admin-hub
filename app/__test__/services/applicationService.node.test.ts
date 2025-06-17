import { clientPromise, mongoMemoryServer } from "@/app/_lib/data/db";
import { getApplications } from "@/app/_services/managementDataService";
import { MongoClient } from "mongodb";

describe("Management DB Service", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await clientPromise;
    const db = client.db("mtl-admin-app");
    await db.collection("applications").deleteMany({});
    await db
      .collection("applications")
      .insertMany([{ name: "App 1" }, { name: "App 2" }]);
  });

  afterAll(async () => {
    if (client) {
      await client.close();
      console.log("MongoDB client closed");
    }

    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      console.log("In-memory MongoDB stopped");
    }
  });

  it("should fetch all applications", async () => {
    const apps = await getApplications();
    expect(apps.length).toBe(2);
    expect(apps[0].name).toBe("App 1");
    expect(apps[1].name).toBe("App 2");
  });
});
