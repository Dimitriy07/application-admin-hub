import { getResourcesNames } from "../_services/resourcesDataService";
import SideNavigationList from "./SideNavigationList";

async function SideNavigationContainer() {
  const resources = await getResourcesNames();

  return (
    <nav className="border-r border-ocean-300 h-full bg-ocean-0 border-t border-b">
      <SideNavigationList resources={resources} />
    </nav>
  );
}

export default SideNavigationContainer;
