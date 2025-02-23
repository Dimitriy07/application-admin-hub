import { getManagementData } from "@/app/_lib/getManagementData";

// fetch all applications from db

export async function getEntities(id: string) {
  const getEntitiesByApplicationId = getManagementData(
    "mtl-admin-app",
    "entities",
    "applicationId"
  );
  const entities = await getEntitiesByApplicationId(id);
  return entities;
}
