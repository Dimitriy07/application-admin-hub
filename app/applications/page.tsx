import { getApplications } from "@/app/_services/applicationService";
import ItemsContainer from "../_components/ItemsContainer";

export default async function Page() {
  const applications = await getApplications();
  return <ItemsContainer items={applications} urlPath="entities" />;
}
