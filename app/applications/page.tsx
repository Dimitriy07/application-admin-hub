// import { auth } from "@/auth";
import ItemsContainer from "@/app/_components/ItemsContainer";
import {
  DB_COLLECTION_LEVEL1,
  DB_COLLECTION_LEVEL2,
} from "@/app/_constants/mongodb-config";
import { getApplications } from "@/app/_services/managementDataService";

export default async function LevelOnePage({
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
      currentCollection={DB_COLLECTION_LEVEL1}
    />
  );
}
