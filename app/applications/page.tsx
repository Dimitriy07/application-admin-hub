import ItemRow from "@/app/_components/ItemRow";

import { getApplications } from "@/app/_lib/applicationService";

// Change after configuring fetching from db

// interface AppItem {
//   id: string;
//   icon: string;
//   name: string;
// }

// const appTestObj: AppItem[] = [
//   {
//     id: "1",
//     icon: "/app.png",
//     name: "Route Optimisation",
//   },
//   {
//     id: "2",
//     icon: "/app1.png",
//     name: "Accident Form App",
//   },
// ];

export default async function Page() {
  const applications = await getApplications();
  return (
    <ul className="flex flex-col">
      {applications.map((app) => (
        <ItemRow item={app} key={app.id} urlPath="entities" />
      ))}
    </ul>
  );
}
