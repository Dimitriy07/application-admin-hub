import { getManagementData } from "@/app/_lib/managementData";

// fetch all applications from db

export async function getApplications() {
  const getApps = getManagementData("mtl-admin-app", "applications");
  const applications = await getApps();
  return applications;
}
