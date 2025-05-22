import { DB_COLLECTION_LEVEL2 } from "@/app/_constants/mongodb-config";
import { getManagementDataByManagementId } from "@/app/_services/managementDataService";

export default async function settingsRestriction(
  entityId: string,
  collectionName: string,
  resourcesArr: string[]
) {
  const entity = await getManagementDataByManagementId(
    DB_COLLECTION_LEVEL2,
    entityId
  );

  if (!entity || "error" in entity) {
    console.error("No entity settings provided");
    return null;
  }

  if (!entity.settings)
    return { message: "Level two system settings have not been set." };

  const { accountType, maxUsers, maxVehicles } = entity.settings;

  const restrictionConfig: Record<
    string,
    { personalLimit: number; defaultLimit: number }
  > = {
    users: { personalLimit: 1, defaultLimit: maxUsers },
    vehicles: { personalLimit: 1, defaultLimit: maxVehicles },
  };

  let isRestricted = false;
  let restrictedMessage: string | undefined;

  if (collectionName in restrictionConfig) {
    const { personalLimit, defaultLimit } = restrictionConfig[collectionName];
    const maxAllowed =
      accountType === "personal" ? personalLimit : defaultLimit;

    isRestricted = resourcesArr.length >= maxAllowed;

    restrictedMessage =
      accountType === "personal"
        ? "Personal account can have only one resource item in each collection"
        : `You have reached the limit of allowed resource items in ${collectionName}`;
  }
  return { isRestricted, restrictedMessage };
}
