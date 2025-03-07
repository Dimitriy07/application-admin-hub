import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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

          const user = await res.json();

          if (!user || !user.password) return null;
          return user;
        } catch (error) {
          console.error("Authorize error:", error);
          throw new Error(`Authentication error: ${error}`);
        }
      },
    }),
  ],
  // session: {
  //   strategy: "jwt",
  // },
  // callbacks: {
  //   async session({ session, token }) {
  //     session.user.id = token.id as string;

  //     return session;
  //   },
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //     }
  //     return token;
  //   },
  // },
  // pages: {
  //   signIn: "/login",
  // },
} satisfies NextAuthConfig;
