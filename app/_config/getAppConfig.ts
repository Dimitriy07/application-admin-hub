import { AppConfig } from "@/app/_types/types";
import { appModules } from "./appModules";

/**
 * Dynamically loads an app config based on its ID or slug.
 * @param refIdToCollectionLevel1 - e.g., "APP_CONFIG_ID1" or "accident-form"
 */
export async function getAppConfig(
  refIdToCollectionLevel1: string
): Promise<AppConfig | undefined> {
  try {
    for (const moduleName of appModules) {
      const [meta, settings, resources, restrictions] = await Promise.all([
        import(`../_app-configs/${moduleName}/appMeta`),
        import(`../_app-configs/${moduleName}/settingsConfig`),
        import(`../_app-configs/${moduleName}/resourceConfig`),
        import(`../_app-configs/${moduleName}/restrictions`).catch(() => null),
      ]);
      const metaId = meta.appMeta.id;

      if (refIdToCollectionLevel1 === metaId) {
        return {
          id: metaId,
          // name: meta.appMeta.name,
          urlSlug: meta.appMeta.urlSlug,
          settings: settings.appSettingsFields,
          resourceConfig: resources.appResourceFields,
          restrictionLogic: restrictions?.restrictionLogic,
        };
      }
    }

    return undefined;
  } catch (error) {
    console.error("Failed to load app config:", error);
    return undefined;
  }
}
