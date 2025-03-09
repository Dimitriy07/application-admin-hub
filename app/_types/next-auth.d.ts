import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & { role: "admin" | "superadmin" | "user" };
  }
  interface User extends DefaultUser {
    role: string;
  }
}
