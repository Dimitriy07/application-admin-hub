"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { appResourceFields } from "@/app/_config/appResourcesConfig";

type ResourcesList = {
  name: string;
  id: string | undefined;
};

function SideNavigationList({ resources }: { resources: ResourcesList[] }) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const params = useParams()
  const resourceType = searchParams.get("resourceType");
  const appId = params.appId as string;
  if (typeof appId !== "string" || !(appId in appResourceFields)) return null;

  const validFilterKeySet = new Set(
    Object.keys(appResourceFields[appId as keyof typeof appResourceFields])
  );
  

  return (
    <ul>
      {resources
        .filter((res) => validFilterKeySet.has(res.name))
        .map((res) => (
          <Link href={`${path}?resourceType=${res.name}`} key={res.name}>
            <li
              className={`hover:border cursor-pointer px-1 ${
                res.name === resourceType ? "border shadow-md" : ""
              }`}
            >
              <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
            </li>
          </Link>
        ))}
    </ul>
  );
}

export default SideNavigationList;
