import ItemsContainer from "../_components/ItemsContainer";
import { getApplications } from "../_services/managementDataService";

export default async function Page() {
  const applications = await getApplications();
  return <ItemsContainer items={applications} urlPath="entities" />;
}
