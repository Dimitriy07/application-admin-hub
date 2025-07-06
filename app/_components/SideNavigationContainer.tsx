import { getResourcesNames } from "@/app/_services/data-service/resourcesDataService";
import SideNavigationList from "./SideNavigationList";
import { getAppConfig } from "@/app/_config/getAppConfig";

async function SideNavigationContainer({
  refIdToCollectionLevel1,
}: {
  refIdToCollectionLevel1: string;
}) {
  const resources = await getResourcesNames();
  const config = await getAppConfig(refIdToCollectionLevel1);
  const resourceConfig = config?.resourceConfig;
  if (!resourceConfig) return null;

  return (
    <nav className="border rounded-md shadow-md h-full ">
      <SideNavigationList
        resources={resources}
        resourceConfig={resourceConfig}
      />
    </nav>
  );
}

export default SideNavigationContainer;
