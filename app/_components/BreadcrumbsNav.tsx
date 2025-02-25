"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BreadcrumbsNavProps } from "@/app/_types/types";

//MAXIMUM PATH LENGTH DEPENDS ON THE NUMBER OF LEVELS OF MANAGEMENT
const MAX_PATH_LENGTH = 6;

export default function BreadcrumbsNav({
  separator = "&rarr;",
  homeElement,
  activeClass,
  listClass,
  containerClass,
}: BreadcrumbsNavProps) {
  const path = usePathname();
  // /applications/_id/entities/_id/accounts/_id/recources
  const pathNames = path.split("/").filter((path) => path);

  return (
    <nav aria-label="breadcrumb-navigation">
      <ul className={containerClass}>
        <li className={listClass}>
          <Link href="/">{homeElement}</Link>
        </li>
        {pathNames.length > 0 && " " + separator}
        {pathNames.map((pathName, index) => {
          if (index % 2 === 0 && index <= MAX_PATH_LENGTH) {
            const crumbHref = "/" + pathNames.slice(0, index + 1).join("/");
            //CHECK IF THE PATH IS THE CURRENT PATH OR THE MAXIMUM ALLOWED PATH
            const crumbClass =
              path === crumbHref || index === MAX_PATH_LENGTH
                ? `${listClass} ${activeClass}`
                : listClass;
            const crumbLabel =
              pathName[0].toUpperCase() + pathName.slice(1, pathName.length);
            return (
              <React.Fragment key={index}>
                <li className={crumbClass}>
                  <Link href={crumbHref}>{crumbLabel}</Link>
                </li>
                {index < pathNames.length - 1 &&
                  index < MAX_PATH_LENGTH &&
                  separator}
              </React.Fragment>
            );
          }
        })}
      </ul>
    </nav>
  );
}
