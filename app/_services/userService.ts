import { getResourceData } from "@/app/_lib/getResourceData";

// fetch all applications from db

export async function getUsers(id: string) {
  const getUsersByAccountId = getResourceData(
    "mtl-admin-resources",
    "users",
    "accountId"
  );
  const users = await getUsersByAccountId(id);
  return users;
}
