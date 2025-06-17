import redis from "@/app/_lib/redis";

describe("Redis client", () => {
  it("should be defined and ready", () => {
    expect(redis).toBeDefined();
    expect(typeof redis.get).toBe("function");
  });
  //   it("can set and get a value", async () => {
  //     await redis.set("test-key", "value123");
  //     const value = await redis.get("test-key");
  //     expect(value).toBe("value123");
  //   });
});
