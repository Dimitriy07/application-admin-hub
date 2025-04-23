import ItemsContainer from "@/app/_components/ItemsContainer";
import ResourcesMessage from "@/app/_components/ResourcesMessage";
import { getResourcesByCollection } from "@/app/_services/resourcesDataService";

export default async function ResourcePage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    resourceType?: string;
    resourceId: string;
    edit: string;
  }>;
  params: Promise<{ accountId: string; entityId: string; appId: string }>;
}) {
  const { accountId, appId } = await params;
  const resolvedSearchParams = await searchParams;
  const collectionName = resolvedSearchParams.resourceType;

  const resourceId = resolvedSearchParams.resourceId;
  const isEdit = resolvedSearchParams.edit;

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
      <ItemsContainer
        items={resourcesArr}
        resourceId={resourceId}
        collectionName={collectionName}
        appId={appId}
        isEdit={isEdit}
      />
    </>
  );
}

export const fetchCache = "force-no-store";
