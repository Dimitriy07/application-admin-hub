import { getManagementDataByManagementId } from "@/app/_services/data-service/managementDataService";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
} from "@/app/_constants/mongodb-config";
import { AppConfig } from "@/app/_types/types";

type SettingsObject = {
  [DB_COLLECTION_LEVEL2]?: Record<string, string> | null;
  [DB_COLLECTION_LEVEL3]?: Record<string, string> | null;
};

export async function getSettings(
  config: AppConfig,
  refIdToCollectionLevel2: string,
  refIdToCollectionLevel3: string
) {
  const settingSchema = config?.settings;
  // FIND OUT WHICH LEVEL HAS SETTINGS (LEVEL2, LEVEL3)
  const settingsLevels = Object.keys(settingSchema);

  const settings: SettingsObject = {};
  for (const curLevel of settingsLevels) {
    if (curLevel === DB_COLLECTION_LEVEL2) {
      const managementData = await getManagementDataByManagementId(
        DB_COLLECTION_LEVEL2,
        refIdToCollectionLevel2
      );
      if (!managementData || "error" in managementData) {
        console.error("Error fetching management data or result is null.");
        settings[DB_COLLECTION_LEVEL2] = null;
      } else {
        settings[DB_COLLECTION_LEVEL2] = managementData.settings ?? null;
      }
    } else if (curLevel === DB_COLLECTION_LEVEL3) {
      const managementData = await getManagementDataByManagementId(
        DB_COLLECTION_LEVEL3,
        refIdToCollectionLevel3
      );
      if (!managementData || "error" in managementData) {
        console.error("Error fetching management data or result is null.");
        settings[DB_COLLECTION_LEVEL3] = null;
      } else {
        settings[DB_COLLECTION_LEVEL3] = managementData.settings ?? null;
      }
    } else {
      throw new Error(
        `Invalid settings level: ${curLevel}. Match the settings example in documents`
      );
    }
  }
  return settings;
}
