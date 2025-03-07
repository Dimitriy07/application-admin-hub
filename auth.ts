import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/_lib/db";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// export const runtime = "nodejs"; // Ensures NextAuth runs in Node.js environment

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  ...authConfig,
  session: { strategy: "jwt" },
});
