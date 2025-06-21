import { APP_CONFIG_ID1 } from "@/app/_constants/mongodb-config";
import { appResourceFields } from "@/app/_config/appResourcesConfigs";
import { appSettingsFields } from "@/app/_config/appSettingsConfigs";

type AppSettingsFields = typeof appSettingsFields;

type AppResourceFields = typeof appResourceFields;

type AppConfig = {
  urlSlug: string;
  settings: AppSettingsFields;
  resourceConfig: AppResourceFields;
};

const appRoutingMap: Record<string, AppConfig> = {
  [APP_CONFIG_ID1]: {
    urlSlug: "1",
    settings: appSettingsFields,
    resourceConfig: appResourceFields,
  },
  // future mappings:
  // [APP_CONFIG_ID2]: "2",
  // [APP_CONFIG_ID3]: "3",
};

export default function urlAndConfigAppSwitcher(
  id: string
): AppConfig | undefined {
  return appRoutingMap[id];
}
