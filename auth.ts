import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/_lib/data/db";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { getUserById } from "@/app/_services/userDataService";
import type { Adapter } from "next-auth/adapters";
// import util from "util";
// export const runtime = "nodejs"; // Ensures NextAuth runs in Node.js environment

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/error",
  },
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  ...authConfig,
  session: { strategy: "jwt" },
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
        // console.log("IN SESSION TOKEN " + util.inspect(session));
      }
      return session;
    },
    async jwt({ token }) {
      // console.log("Token " + util.inspect(token));
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
});
