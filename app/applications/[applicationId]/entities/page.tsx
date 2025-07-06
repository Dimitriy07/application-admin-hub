import ItemsContainer from "@/app/_components/ItemsContainer";
import ProtectedComponent from "@/app/_components/ProtectedComponent";
import ToolboxBar from "@/app/_components/ToolboxBar";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
} from "@/app/_constants/mongodb-config";
import { getEntities } from "@/app/_services/data-service/managementDataService";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LevelTwoPage({
  params,
  searchParams,
}: {
  params: Promise<{ [DB_REFERENCE_TO_COL1]: string }>;
  searchParams: Promise<{
    query: string;
    settings: string;
    managementId: string;
    edit: string;
  }>;
}) {
  const session = await auth();
  const { [DB_REFERENCE_TO_COL1]: refIdToCollectionLevel1 } = await params;
  const { query, settings, managementId, edit } = await searchParams;

  // AUTHENTICATION

  const isSuperAdmin = session?.user.role === "superadmin";
  const hasAccess =
    isSuperAdmin ||
    session?.user[DB_REFERENCE_TO_COL1] === refIdToCollectionLevel1;

  if (!hasAccess) {
    redirect(DEFAULT_LOGIN_REDIRECT);
  }

  const entities = isSuperAdmin
    ? await getEntities(refIdToCollectionLevel1)
    : await getEntities(
        refIdToCollectionLevel1,
        session?.user[DB_REFERENCE_TO_COL2]
      );

  return (
    <ProtectedComponent refIdToCollectionLevel1={refIdToCollectionLevel1}>
      <ItemsContainer
        userRole={session?.user.role}
        items={entities}
        urlPath={DB_COLLECTION_LEVEL3}
        query={query}
        refIdToCollectionLevel1={refIdToCollectionLevel1}
        currentCollection={DB_COLLECTION_LEVEL2}
        isSettings={settings}
        managementId={managementId}
        isEdit={edit}
        refNameToCollection={DB_REFERENCE_TO_COL2}
      />
      <ToolboxBar />
    </ProtectedComponent>
  );
}
