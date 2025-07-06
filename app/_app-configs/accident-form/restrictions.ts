// import { DB_COLLECTION_LEVEL2 } from "@/app/_constants/mongodb-config";
// import { getManagementDataByManagementId } from "@/app/_services/data-service/managementDataService";

// export default async function usersVehiclesRestriction(
//   refIdToCollectionLevel2: string,
//   collectionName: string,
//   resourcesArr: string[]
// ) {
//   const entity = await getManagementDataByManagementId(
//     DB_COLLECTION_LEVEL2,
//     refIdToCollectionLevel2
//   );

//   if (!entity || "error" in entity) {
//     console.error("No entity settings provided");
//     return null;
//   }

//   if (!entity.settings)
//     return { message: "Level two system settings have not been set." };

//   const { accountType, maxUsers, maxVehicles } = entity.settings;

//   const restrictionConfig: Record<
//     string,
//     { personalLimit: number; defaultLimit: number }
//   > = {
//     users: { personalLimit: 1, defaultLimit: maxUsers ?? 1 },
//     vehicles: { personalLimit: 1, defaultLimit: maxVehicles ?? 1 },
//   };

//   let isRestricted = false;
//   let restrictedMessage: string | undefined;

//   if (collectionName in restrictionConfig) {
//     const { personalLimit, defaultLimit } = restrictionConfig[collectionName];
//     const maxAllowed =
//       accountType === "personal" ? personalLimit : defaultLimit;

//     isRestricted = resourcesArr.length >= maxAllowed;

//     restrictedMessage =
//       accountType === "personal"
//         ? "Personal account can have only one resource item in each collection"
//         : `The maximum number of ${collectionName} allowed (${maxAllowed}) has been reached.`;
//   }
//   return { isRestricted, restrictedMessage };
// }

import { DB_COLLECTION_LEVEL2 } from "@/app/_constants/mongodb-config";
import type { RestrictionLogicFn } from "@/app/_types/types";

type AccountType = "personal" | "fleet";
type ResourceType = "users" | "vehicles";

type LimitUnits = Record<ResourceType, { personal: number; fleet: number }>;

export const restrictionLogic: RestrictionLogicFn = ({
  collectionName,
  settings,
  resourcesArr,
}) => {
  const {
    accountType,
    maxUsers = 1,
    maxVehicles = 1,
  } = settings[DB_COLLECTION_LEVEL2] as {
    accountType: AccountType;
    maxUsers?: number;
    maxVehicles?: number;
  };

  if (
    (collectionName !== "users" && collectionName !== "vehicles") ||
    (accountType !== "personal" && accountType !== "fleet")
  ) {
    return { isRestricted: false };
  }

  const limits: LimitUnits = {
    users: { personal: 1, fleet: maxUsers },
    vehicles: { personal: 1, fleet: maxVehicles },
  };

  const limit = limits[collectionName][accountType];
  const isRestricted = resourcesArr.length >= limit;

  return {
    isRestricted,
    restrictedMessage: isRestricted
      ? accountType === "personal"
        ? `Personal accounts can have only 1 ${collectionName}.`
        : `Max ${collectionName} limit (${limit}) reached.`
      : undefined,
  };
};
