import { DB_COLLECTION_LEVEL2 } from "@/app/_constants/mongodb-config";

export const appSettingsFields = {
  [DB_COLLECTION_LEVEL2]: {
    accountType: {
      type: "select",
      name: "accountType",
      id: "accountType",
      labelName: "Account Type",
      options: [
        { value: "", content: "Select account type" },
        { value: "fleet", content: "Fleet" },
        { value: "personal", content: "Personal account" },
      ],
    },
    maxUsers: {
      type: "number",
      id: "maxUsers",
      name: "maxUsers",
      labelName: "Maximum Users",
      min: 1,
    },
    maxVehicles: {
      type: "number",
      id: "maxVehicles",
      name: "maxVehicles",
      labelName: "Maximum Vehicles",
      min: 1,
    },
  },
} as const;
