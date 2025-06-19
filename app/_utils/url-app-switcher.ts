import { APP_CONFIG_ID1 } from "@/app/_constants/mongodb-config";

const appRoutingMap: Record<string, string> = {
  [APP_CONFIG_ID1]: "1",
  // future mappings:
  // [APP_CONFIG_ID2]: "2",
  // [APP_CONFIG_ID3]: "3",
};

export default function urlAppSwitcher(id: string): string | undefined {
  return appRoutingMap[id];
}
