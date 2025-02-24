import Link from "next/link";
import { getCollectionNames } from "@/app/_lib/resource-data";
import { headers } from "next/headers";
import { DB_RESOURCES_NAME } from "../_constants/mongodb-config";

async function SideNavigation() {
  const resources = await getCollectionNames(DB_RESOURCES_NAME);
  const headersList = await headers();
  const header = headersList.get("x-full-url");
  return (
    <nav className="border-r border-ocean-300 h-full bg-ocean-0 border-t border-b">
      <ul>
        {resources.map((res) => {
          return (
            <li key={res.name}>
              <Link href={`${header}/${res.name}`} shallow={true}>
                <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SideNavigation;
