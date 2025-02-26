import ItemsContainer from "@/app/_components/ItemsContainer";
import { getResourcesByCollection } from "@/app/_services/resourcesDataService";

export default async function Page({ searchParams }: { searchParams: any }) {
  // const paramsData = await params;
  // const { collectionId, accountId } = paramsData;
  // const resources = await getResourcesByCollection(collectionId, accountId);
  // const resourcesArr = resources.map((res) => JSON.parse(JSON.stringify(res)));
  // console.log(resourcesArr);
  const params = searchParams;
  console.log(params);

  return <div>Hello</div>;
  // return <ItemsContainer items={} />;
}
