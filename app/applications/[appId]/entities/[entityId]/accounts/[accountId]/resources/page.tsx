import ItemsContainer from "@/app/_components/ItemsContainer";
import ResourcesMessage from "@/app/_components/ResourcesMessage";
import { getResourcesByCollection } from "@/app/_services/resourcesDataService";

export default async function Page({ searchParams,params }: { searchParams: Promise<{resourcesType: string}>, params: Promise<{accountId:string}> }) {
  const {resourcesType:collectionName} = await searchParams;
  const {accountId} = await params

let resourcesArr= []

if (collectionName){
try{

  const resources = await getResourcesByCollection(collectionName, accountId);
  resourcesArr = resources.map((res) => JSON.parse(JSON.stringify(res)));
} catch(err){ console.error('Failed to fetch resources')}

}
  return<>
  {collectionName ?  <ItemsContainer items={resourcesArr} />: <ResourcesMessage />
}
  </>
    // return <ItemsContainer items={} />;
}
