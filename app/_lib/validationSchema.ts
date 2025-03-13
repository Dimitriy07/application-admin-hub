import { z } from "zod";

enum Roles {
  "superadmin",
  "admin",
  "user",
}

const userRegistrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(6).max(30),
  password: z.string().min(1),
  role: z.nativeEnum(Roles),
});

const userLoginSchema = z.object({
  email: z.string().email().nullish(),
  password: z.string().min(1).nullish(),
});

export { userLoginSchema, userRegistrationSchema };
