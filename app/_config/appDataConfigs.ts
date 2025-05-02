import { APP_CONFIG_ID1 } from "@/app/_constants/mongodb-config";

export const appResourceFields = {
  [APP_CONFIG_ID1]: {
    users: {
      name: { type: "text", id: "name", name: "name", labelName: "Name" },
      email: { type: "text", id: "email", name: "email", labelName: "Email" },
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
            dob: {
              type: "text",
              id: "dob",
              name: "dob",
              labelName: "Date of Birth",
            },
          },
        },
      ],
    },
    // !! fix right field data when it known
    drivers: {
      name: { type: "text", id: "name", name: "name", labelName: "Name" },
      make: { type: "text", id: "make", name: "make", labelName: "Make" },
      model: { type: "text", id: "model", name: "model", labelName: "Model" },
      owner: { type: "text", id: "owner", name: "owner", labelName: "Owner" },
    },
    vehicles: {
      name: { type: "text", id: "name", name: "name", labelName: "Name" },
      make: { type: "text", id: "make", name: "make", labelName: "Make" },
      model: { type: "text", id: "model", name: "model", labelName: "Model" },
      owner: { type: "text", id: "owner", name: "owner", labelName: "Owner" },
    },
  },
} as const;
