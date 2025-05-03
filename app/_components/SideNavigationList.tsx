"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type ResourcesList = {
  name: string;
  id: string | undefined;
};

function SideNavigationList({ resources }: { resources: ResourcesList[] }) {
  const path = usePathname();
  const searchParams = useSearchParams();
  return (
    <ul>
      {resources.map((res) => {
        return (
          <Link href={`${path}?resourceType=${res.name}`} key={res.name}>
            <li
              className={`hover:border cursor-pointer px-1 
                 ${
                   res.name === searchParams.get("resourceType")
                     ? "border shadow-md"
                     : ""
                 }`}
            >
              <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
            </li>
          </Link>
        );
      })}
    </ul>
  );
}

export default SideNavigationList;
