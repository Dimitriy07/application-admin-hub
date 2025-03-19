import { z } from "zod";
import { UserRole } from "@/app/_types/types";

const userRegistrationSchema = z
  .object({
    email: z.string().email(),
    name: z
      .string()
      .min(1, { message: "The name must contain minimum 1 character" })
      .max(40, { message: "The name must contain maximum 40 characters" }),
    password: z
      .string()
      .min(6, { message: "The password must contain minimum 6 character" })
      .max(40, { message: "The password must contain maximum 40 characters" }),
    confirm: z.string().min(6).max(40),
    role: z.nativeEnum(UserRole, {
      message: "Please select one of the user roles",
    }),
  })

  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match!",
    path: ["confirm"],
  });

const userLoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .required();

export { userLoginSchema, userRegistrationSchema };
