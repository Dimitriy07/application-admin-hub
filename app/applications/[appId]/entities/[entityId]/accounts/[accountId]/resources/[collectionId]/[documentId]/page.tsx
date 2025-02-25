// import ItemsContainer from "@/app/_components/ItemsContainer";
import { DB_RESOURCES_NAME } from "@/app/_constants/mongodb-config";
import { getResourceByResourceId } from "@/app/_services/resourcesDataService";

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const resourceId = await params;

  const resource = await getResourceByResourceId(DB_RESOURCES_NAME, resourceId.documentId);
  console.log(JSON.stringify(resource));
  return <div>{JSON.stringify(resource)}</div>;
  //   return <ItemsContainer items={} />;
}
