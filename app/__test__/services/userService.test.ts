import clientPromise from "@/app/_lib/data/db";
import { getUsers } from "@/app/_services/resourcesDataService";
import { MongoClient, ObjectId } from "mongodb";

describe("Resource DB Service", () => {
  let client: MongoClient;
  const id = new ObjectId("67b48167487ba2737c77e751");
  beforeAll(async () => {
    client = await clientPromise;
    const db = client.db("mtl-admin-resources");
    console.log("Connected to database: ", db.databaseName);
    await db.collection("users").deleteMany({});
    await db.collection("users").insertMany([
      { name: "User1", accountId: id },
      { name: "User2", accountId: id },
    ]);
    const count = await db.collection("users").countDocuments();
    console.log("Inserted users count:", count); // Should print 2
  });

  afterAll(async () => {
    if (client) await client.close();
  });

  it("should fetch all applications", async () => {
    const users = await getUsers(id.toString());
    expect(users.length).toBe(2);
    expect(users[0].name).toBe("User1");
    expect(users[1].name).toBe("User2");
  });
});
