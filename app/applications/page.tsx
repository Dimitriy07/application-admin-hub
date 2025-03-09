// import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ItemsContainer from "../_components/ItemsContainer";
import { getApplications } from "../_services/managementDataService";

export default async function Page() {
  const session = await auth();
  // console.log(session?.user);
  const applications = await getApplications();
  return <ItemsContainer items={applications} urlPath="entities" />;
}
