import { getManagementData } from "@/app/_lib/managementData";
import { DB_MANAGEMENT_NAME } from "@/app/_constants/mongodb-config";

// fetch all applications from db

export async function getAccounts(id: string) {
  const getAccountsByEntityId = getManagementData(
    DB_MANAGEMENT_NAME,
    "accounts",
    "entityId"
  );
  const accounts = await getAccountsByEntityId(id);
  return accounts;
}
