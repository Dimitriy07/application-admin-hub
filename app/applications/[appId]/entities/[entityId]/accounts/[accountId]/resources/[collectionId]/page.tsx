import ItemsContainer from "@/app/_components/ItemsContainer";
import { getResourcesByCollection } from "@/app/_services/resourcesDataService";

export default async function Page({
  params,
}: {
  params: Promise<{ collectionId: string; accountId: string }>;
}) {
  const paramsData = await params;
  const { collectionId, accountId } = paramsData;
  const resources = await getResourcesByCollection(collectionId, accountId);
  const resourcesArr = resources.map((res) => JSON.parse(JSON.stringify(res)));
  console.log(resourcesArr);
  return <ItemsContainer items={resourcesArr} />;
}
