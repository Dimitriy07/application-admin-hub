import ItemsContainer from "@/app/_components/ItemsContainer";
import { getResources } from "@/app/_services/resourcesService";

export default async function Page({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const collectionName = await params;
  const resources = await getResources(collectionName.collectionId);
  const resourcesArr = resources.map((res) => JSON.parse(JSON.stringify(res)));
  return <ItemsContainer items={resourcesArr} />;
}
