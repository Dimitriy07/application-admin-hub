import { getManagementData } from "@/app/_lib/getManagementData";

// fetch all applications from db

export async function getAccounts(id: string) {
  const getAccountsByEntityId = getManagementData(
    "mtl-admin-app",
    "accounts",
    "entityId"
  );
  const accounts = await getAccountsByEntityId(id);
  return accounts;
}
