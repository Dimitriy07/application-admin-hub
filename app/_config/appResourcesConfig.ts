import { APP_CONFIG_ID1 } from "@/app/_constants/mongodb-config";
import {
  USERS_COLLECTION,
  VEHICLES_COLLECTION,
} from "@/app/_constants/form-names";

export const appResourceFields = {
  [APP_CONFIG_ID1]: {
    [USERS_COLLECTION]: {
      role: {
        type: "select",
        name: "role",
        id: "role",
        labelName: "User Role",
        options: [
          { value: "", content: "Select Role" },
          { value: "admin", content: "Admin" },
          { value: "user", content: "User" },
        ],
      },
      name: { type: "text", id: "name", name: "name", labelName: "Name" },
      email: { type: "text", id: "email", name: "email", labelName: "Email" },

      conditionalFields: [
        {
          when: { field: "role", value: "user" },
          fields: {
            dob: {
              type: "text",
              id: "dob",
              name: "dob",
              labelName: "Date of Birth",
            },
            drivingLicence: {
              type: "text",
              id: "drivingLicence",
              name: "drivingLicence",
              labelName: "Driving Licence",
            },
          },
        },
        {
          when: { field: "role", value: "admin" },
          fields: {
            password: {
              type: "text",
              id: "password",
              name: "password",
              labelName: "New Password",
            },
          },
        },
      ],
    },

    // !! fix right field data when it known
    [VEHICLES_COLLECTION]: {
      name: { type: "text", id: "name", name: "name", labelName: "Name" },
      make: { type: "text", id: "make", name: "make", labelName: "Make" },
      model: { type: "text", id: "model", name: "model", labelName: "Model" },
      owner: { type: "text", id: "owner", name: "owner", labelName: "Owner" },
    },
  },
} as const;
