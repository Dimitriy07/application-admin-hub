import { DefaultUser } from "next-auth";
import { UserSession } from "./types";

export type ExtendedUser = DefaultUser["user"] & UserSession;

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    expires: string;
    error: string;
  }
}
