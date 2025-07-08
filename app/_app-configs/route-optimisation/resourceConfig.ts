import {
  USERS_COLLECTION,
  VEHICLES_COLLECTION,
} from "@/app/_constants/form-names";

export const appResourceFields = {
  [USERS_COLLECTION]: {
    name: { type: "text", id: "name", name: "name", labelName: "Name" },
    email: { type: "email", id: "email", name: "email", labelName: "Email" },
  },

  // !! fix right field data when it known
  [VEHICLES_COLLECTION]: {
    name: { type: "text", id: "name", name: "name", labelName: "Name" },

    owner: { type: "text", id: "owner", name: "owner", labelName: "Owner" },
  },
} as const;
