// import ItemsContainer from "@/app/_components/ItemsContainer";
import { DB_RESOURCES_NAME } from "@/app/_constants/mongodb-config";
import { getResourceData } from "@/app/_lib/resource-data";

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const resourceId = await params;
  const getData = getResourceData(DB_RESOURCES_NAME, "users");
  console.log(getData(resourceId.documentId));
  return <div>hello w</div>;
  //   return <ItemsContainer items={} />;
}
