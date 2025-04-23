import {
  APP_CONFIG_ID1,
  DB_COLLECTION_LEVEL3,
} from "@/app/_constants/mongodb-config";

export const appSettingsFields = {
  [APP_CONFIG_ID1]: {
    [DB_COLLECTION_LEVEL3]: {
      maxUsers: {
        type: "number",
        id: "maxUsers",
        name: "maxUsers",
        labelName: "Maximum Users",
        min: 1,
      },
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
    },
  },
} as const;
