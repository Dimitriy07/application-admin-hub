import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/app/_lib/data/db";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getUserById } from "@/app/_services/data-service/userDataService";
import type { Adapter } from "next-auth/adapters";
import {
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
} from "./app/_constants/mongodb-config";
// import util from "util";
// export const runtime = "nodejs"; // Ensures NextAuth runs in Node.js environment

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  ...authConfig,
  session: { strategy: "jwt", maxAge: 10 * 60 },
  callbacks: {
    async signIn({ user }) {
      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (token.name && session.user) {
        session.user.name = token.name;
      }
      if (token[DB_REFERENCE_TO_COL2] && session.user) {
        session.user[DB_REFERENCE_TO_COL2] = token[DB_REFERENCE_TO_COL2];
      }
      if (token[DB_REFERENCE_TO_COL1] && session.user) {
        session.user[DB_REFERENCE_TO_COL1] = token[DB_REFERENCE_TO_COL1];
      }
      // console.log("IN SESSION TOKEN " + util.inspect(session));
      return session;
    },
    async jwt({ token }) {
      // console.log("Token " + util.inspect(token));
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.name = existingUser.name;
      token[DB_REFERENCE_TO_COL2] = existingUser[DB_REFERENCE_TO_COL2];
      token[DB_REFERENCE_TO_COL1] = existingUser[DB_REFERENCE_TO_COL1];
      return token;
    },
  },
});
