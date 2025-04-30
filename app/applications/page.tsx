// import { auth } from "@/auth";
import ItemsContainer from "../_components/ItemsContainer";
import { DB_COLLECTION_LEVEL2 } from "../_constants/mongodb-config";
import { getApplications } from "../_services/managementDataService";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const applications = await getApplications();
  return (
    <ItemsContainer
      items={applications}
      urlPath={DB_COLLECTION_LEVEL2}
      query={query}
    />
  );
}
