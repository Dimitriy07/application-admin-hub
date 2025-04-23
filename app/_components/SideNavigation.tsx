import Link from "next/link";
import { headers } from "next/headers";
import { getResourcesNames } from "../_services/resourcesDataService";

async function SideNavigation() {
  const resources = await getResourcesNames();
  const headersList = await headers();
  const header = headersList.get("x-full-url");
  if (!header) throw new Error("No header URL found");
  const url = new URL(header);
  url.searchParams.delete("resourceType");
  url.searchParams.delete("resourceId");
  return (
    <nav className="border-r border-ocean-300 h-full bg-ocean-0 border-t border-b">
      <ul>
        {resources.map((res) => {
          const newUrl = new URL(url.toString());
          newUrl.searchParams.set("resourceType", res.name);
          return (
            <li key={res.name}>
              <Link href={`${newUrl}`}>
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
