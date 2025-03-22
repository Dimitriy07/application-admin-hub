import ResourceToolboxBar from "@/app/_components/ResourceToolboxBar";
import ItemsContainer from "@/app/_components/ItemsContainer";
import ResourcesMessage from "@/app/_components/ResourcesMessage";
import { getResourcesByCollection } from "@/app/_services/resourcesDataService";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ resourceType?: string; resourceId: string }>;
  params: Promise<{ accountId: string; entityId: string; appId: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { entityId, accountId } = await params;
  const collectionName = resolvedSearchParams.resourceType;

  const resourceId = resolvedSearchParams.resourceId;

  let resourcesArr = [];

  if (collectionName) {
    try {
      const resources = await getResourcesByCollection(
        collectionName,
        accountId
      );
      resourcesArr = resources.map((res) => JSON.parse(JSON.stringify(res)));
    } catch (err) {
      console.error("Failed to fetch resources", err);
    }
  }
  if (!collectionName) {
    return <ResourcesMessage />;
  }

  return (
    <>
      <ResourceToolboxBar entityId={entityId} accountId={accountId} />
      <ItemsContainer
        items={resourcesArr}
        resourceId={resourceId}
        collectionName={collectionName}
      />
    </>
  );
}

export const fetchCache = "force-no-store";
