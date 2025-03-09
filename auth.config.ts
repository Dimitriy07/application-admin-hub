import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserSession } from "./app/_types/types";
// import util from "util";

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // When deploying to production, set the NEXTAUTH_URL environment variable to the canonical URL of your site.
        try {
          const res = await fetch(`http://localhost:3000/api/auth/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) throw new Error("Authentication failed");
          const user: UserSession = await res.json();
          if (!user || !user.password) return null;
          return user;
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error(`Authentication error: ${error}`);
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
