import { APP_CONFIG_ID1 } from "../_constants/mongodb-config";

export default function urlAppSwitcher(id: string): string | undefined {
  // APP NUMBER IS TO NAVIGATE THROUGH DIFFERENT PRE DEFINED APPS
  let appNumber;
  switch (id) {
    case APP_CONFIG_ID1:
      appNumber = "1";
      break;
  }

  return appNumber;
}
