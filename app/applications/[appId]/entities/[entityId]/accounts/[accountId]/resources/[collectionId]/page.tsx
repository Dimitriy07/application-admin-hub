import ItemsContainer from "@/app/_components/ItemsContainer";
import { getResourcesByAccountId } from "@/app/_services/resourcesDataService";

export default async function Page({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const collectionName = await params;
  const resources = await getResourcesByAccountId(collectionName.collectionId);
  const resourcesArr = resources.map((res) => JSON.parse(JSON.stringify(res)));
  console.log(resourcesArr);
  return <ItemsContainer items={resourcesArr} />;
}
