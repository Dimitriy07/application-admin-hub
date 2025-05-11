import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
} from "@/app/_constants/mongodb-config";
import { getEntities } from "@/app/_services/managementDataService";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ appId: string }>;
  searchParams: Promise<{ query: string }>;
}) {
  const session = await auth();
  const { appId } = await params;
  const { query } = await searchParams;
  let entities;
  if (session?.user.role !== "superadmin" && session?.user.appId !== appId) {
    redirect(DEFAULT_LOGIN_REDIRECT);
  } else if (session?.user.role === "superadmin") {
    entities = await getEntities(appId);
  } else entities = await getEntities(appId, session?.user.entityId);

  return (
    <ProtectedComponent appId={appId}>
      <ItemsContainer
        items={entities}
        urlPath={DB_COLLECTION_LEVEL3}
        query={query}
        appId={appId}
        currentCollection={DB_COLLECTION_LEVEL2}
      />
    </ProtectedComponent>
  );
}
