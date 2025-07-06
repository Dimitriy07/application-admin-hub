"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { DB_REFERENCE_TO_COL1 } from "@/app/_constants/mongodb-config";

type ResourcesList = {
  name: string;
  id: string | undefined;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResourceConfig = Record<string, any>;

function SideNavigationList({
  resources,
  resourceConfig,
}: {
  resources: ResourcesList[];
  resourceConfig: ResourceConfig;
}) {
  const path = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const resourceType = searchParams.get("resourceType");
  const refIdToCollectionLevel1 = params[DB_REFERENCE_TO_COL1] as string;

  if (typeof refIdToCollectionLevel1 !== "string" || !resourceConfig)
    return null;

  const validFilterKeySet = new Set(Object.keys(resourceConfig));

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
