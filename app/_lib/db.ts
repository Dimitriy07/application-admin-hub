import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

// Change in .env file
const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please Add mongodb URI");
}

let client;
let clientPromise: Promise<MongoClient>;
if (process.env.NODE_ENV === "test") {
  clientPromise = MongoMemoryServer.create({
    binary: {
      version: "7.0.14",
    },
  }).then((server) => {
    return new MongoClient(server.getUri(), options).connect();
  });
} else if (process.env.NODE_ENV === "development") {
  // In development mode, to preserve the connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
      .connect()
      .then((client) => client)
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        return Promise.reject(error);
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode
  client = new MongoClient(uri, options);
  clientPromise = client
    .connect()
    .then((client) => client)
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      return Promise.reject(error);
    });
}

export default clientPromise;
