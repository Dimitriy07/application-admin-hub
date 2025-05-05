/* eslint-disable @typescript-eslint/no-unused-vars */
import { z, ZodSchema } from "zod";
import { FormConfigWithConditions, UserRole } from "@/app/_types/types";
import {
  ACCOUNT_SETTINGS_SCHEMA,
  ADD_ITEM_SCHEMA,
  USER_LOGIN_SCHEMA,
  USER_REGISTRATION_SCHEMA,
} from "@/app/_constants/schema-names";

// const userRegistrationSchema = z
//   .object({
//     email: z.string().email(),
//     name: z
//       .string()
//       .min(1, { message: "The name must contain minimum 1 character" })
//       .max(40, { message: "The name must contain maximum 40 characters" }),
//     password: z
//       .string()
//       .min(6, { message: "The password must contain minimum 6 character" })
//       .max(40, { message: "The password must contain maximum 40 characters" }),
//     confirm: z.string().min(6).max(40),
//     role: z.nativeEnum(UserRole, {
//       message: "Please select one of the user roles",
//     }),
//   })
//   .refine((data) => data.password === data.confirm, {
//     message: "Passwords don't match!",
//     path: ["confirm"],
//   });

const userRegistrationSchema = z
  .discriminatedUnion("role", [
    z.object({
      role: z.literal("admin"),
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
      confirm: z.string().min(6),
    }),
    z.object({
      role: z.literal("user"),
      name: z.string().min(1),
      email: z.string().email(),
      dob: z.string().min(1, "Date of Birth is required"),
      drivingLicence: z.string().min(1, "Driving Licence is required"),
    }),
  ])
  .superRefine((data, ctx) => {
    if (data.role === "admin" && data.password !== data.confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirm"],
      });
    }
  });

const userLoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .required();

const addItemSchema = z.object({
  name: z.string().min(1),
});

const accountSettings = z.object({
  maxUsers: z.number().min(1),
  accountType: z.string().min(1),
});

const schemas = {
  [USER_REGISTRATION_SCHEMA]: userRegistrationSchema,
  [USER_LOGIN_SCHEMA]: userLoginSchema,
  [ADD_ITEM_SCHEMA]: addItemSchema,
  [ACCOUNT_SETTINGS_SCHEMA]: accountSettings,
};

type SchemaName = keyof typeof schemas;

type SchemaMap = {
  [K in SchemaName]: (typeof schemas)[K];
};

export function createZodSchema<T extends SchemaName>(
  zodSchemaName: T
): SchemaMap[T];
export function createZodSchema(
  zodSchemaName: string | undefined,
  section: FormConfigWithConditions
): ZodSchema;

// FOR FORMGENERATOR CONDITIONALLY CHECK WHAT ZOD FORM USED AND IF THERE IS NO FORM IT HAS TO USE DEFAULT DYNAMIC FORM
export default function createZodSchema(
  zodSchemaName: string | undefined,
  section?: FormConfigWithConditions
): ZodSchema {
  switch (zodSchemaName) {
    case USER_REGISTRATION_SCHEMA:
      return userRegistrationSchema;
    case USER_LOGIN_SCHEMA:
      return userLoginSchema;
    case ADD_ITEM_SCHEMA:
      return addItemSchema;
    case ACCOUNT_SETTINGS_SCHEMA:
      return accountSettings;
    default: {
      if (!section) {
        throw new Error("Section is required to generate dynamic schema.");
      }

      const shape: Record<string, z.ZodTypeAny> = {};

      for (const [key, field] of Object.entries(section)) {
        if (!Array.isArray(field))
          shape[key] = z.string().min(1, `${field.labelName} is required`);
      }

      return z.object(shape);
    }
  }
}
