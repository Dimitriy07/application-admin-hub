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
