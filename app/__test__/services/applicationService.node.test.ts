import {
  DB_COLLECTION_LEVEL1,
  DB_MANAGEMENT_NAME,
} from "@/app/_constants/mongodb-config";
import { clientPromise, mongoMemoryServer } from "@/app/_lib/data/db";
import { getApplications } from "@/app/_services/data-service/managementDataService";
import { MongoClient } from "mongodb";

describe("Management DB Service", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await clientPromise;
    const db = client.db(DB_MANAGEMENT_NAME);
    await db.collection(DB_COLLECTION_LEVEL1).deleteMany({});
    await db
      .collection(DB_COLLECTION_LEVEL1)
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
