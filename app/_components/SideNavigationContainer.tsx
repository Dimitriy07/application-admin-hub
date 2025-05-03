import { getResourcesNames } from "../_services/resourcesDataService";
import SideNavigationList from "./SideNavigationList";

async function SideNavigationContainer() {
  const resources = await getResourcesNames();

  return (
    <nav className="border rounded-md shadow-md h-full ">
      <SideNavigationList resources={resources} />
    </nav>
  );
}

export default SideNavigationContainer;
