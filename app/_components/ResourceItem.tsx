import { getResourceByResourceId } from "@/app/_services/resourcesDataService";

async function ResourceItem({
  collectionName,
  resourceId,
}: {
  collectionName: string;
  resourceId: string;
}) {
  const resolvedItem = await getResourceByResourceId(
    collectionName,
    resourceId
  );
  console.log(resolvedItem);
  const item = JSON.parse(JSON.stringify(resolvedItem));
  return <div>{item?.regNumber || "new"}</div>;
}

export default ResourceItem;
