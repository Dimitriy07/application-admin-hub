/* eslint-disable @typescript-eslint/no-explicit-any */
export type AppSettingsFields = Record<string, any>;
export type AppResourceFields = Record<string, any>;

export type AppConfig = {
  id: string;
  // name: string;
  urlSlug: string;
  settings: AppSettingsFields;
  resourceConfig: AppResourceFields;
  restrictionLogic?: (...args: any[]) => any;
};

/**
 * Dynamically loads an app config based on its ID or slug.
 * @param refIdToCollectionLevel1 - e.g., "APP_CONFIG_ID1" or "accident-form"
 */
export async function getAppConfig(
  refIdToCollectionLevel1: string
): Promise<AppConfig | undefined> {
  try {
    // Import all app configs and match the requested one
    const appModules = [
      "accident-form",
      // "fleet-optimizer",
      // "delivery-hub",
    ];

    for (const moduleName of appModules) {
      const [meta, settings, resources, restrictions] = await Promise.all([
        import(`@/app/_app-configs/${moduleName}/appMeta`),
        import(`@/app/_app-configs/${moduleName}/settingsConfig`),
        import(`@/app/_app-configs/${moduleName}/resourceConfig`),
        import(`@/app/_app-configs/${moduleName}/restrictions`).catch(
          () => null
        ),
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
