import ItemsContainer from "@/app/_components/ItemsContainer";
import { getEntities } from "@/app/_services/managementDataService";

export default async function Page({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const id = await params;
  const entities = await getEntities(id.appId);
  return <ItemsContainer items={entities} urlPath="accounts" />;
}
