import ItemsContainer from "@/app/_components/ItemsContainer";
import { DB_COLLECTION_LEVEL3 } from "@/app/_constants/mongodb-config";
import { getEntities } from "@/app/_services/managementDataService";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ query: string }>;
}) {
  const id = await params;
  const { query } = await searchParams;
  const entities = await getEntities(id.appId);
  return (
    <ItemsContainer
      items={entities}
      urlPath={DB_COLLECTION_LEVEL3}
      query={query}
    />
  );
}
