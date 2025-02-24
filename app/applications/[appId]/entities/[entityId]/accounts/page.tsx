import ItemsContainer from "@/app/_components/ItemsContainer";
import { getAccounts } from "@/app/_services/accountService";

export default async function Page({
  params,
}: {
  params: Promise<{ entityId: string }>;
}) {
  const id = await params;
  const accounts = await getAccounts(id.entityId);
  return <ItemsContainer items={accounts} urlPath="resources" />;
}
