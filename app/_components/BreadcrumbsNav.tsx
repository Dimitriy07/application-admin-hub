"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// type BreadcrumbsType = {
//   id: string;
//   urlPath: string;
// };

interface BreadcrumbsNavProps {
  separator: string;
  homeElement: string;
  activeClass: string;
  listClass: string;
  containerClass: string;
}

export default function BreadcrumbsNav({
  separator = "&rarr;",
  homeElement,
  activeClass,
  listClass,
  containerClass,
}: BreadcrumbsNavProps) {
  const path = usePathname();
  // /applications/_id/entities/_id/accounts/_id/users...
  const pathNames = path.split("/").filter((path) => path);

  return (
    <div>
      <ul className={containerClass}>
        <li className={listClass}>
          <Link href="/">{homeElement}</Link>
        </li>
        {pathNames.length > 0 && " " + separator}
        {pathNames.map((pathName, index) => {
          if (index % 2 === 0) {
            let crumbHref = "/" + pathNames.slice(0, index + 1).join("/");
            let crumbClass =
              path === crumbHref ? `${listClass} ${activeClass}` : listClass;
            let crumbLabel =
              pathName[0].toUpperCase() + pathName.slice(1, pathName.length);
            return (
              <React.Fragment key={index}>
                <li className={crumbClass}>
                  <Link href={crumbHref}>{crumbLabel}</Link>
                </li>
                {index < pathNames.length - 1 && separator}
              </React.Fragment>
            );
          }
        })}
      </ul>
    </div>
  );
}
