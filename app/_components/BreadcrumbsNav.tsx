/**
 * BreadcrumbsNav Component
 *
 * This client-side React component renders a dynamic breadcrumb navigation
 * bar based on the current URL path using Next.js's `usePathname()` hook.
 * It helps users understand their current location in a nested route structure
 * and provides clickable links for navigating back to previous sections.
 *
 * @component
 * @example
 * <BreadcrumbsNav
 *   separator=">"
 *   homeElement="Home"
 *   activeClass="font-bold text-blue-600"
 *   listClass="inline-block px-2"
 *   containerClass="flex space-x-2"
 * />
 *
 * @prop {string} separator - The symbol or string used to separate breadcrumb items.
 * @prop {string} homeElement - The label for the "home" link (e.g., "Dashboard").
 * @prop {string} activeClass - CSS classes applied to the last active breadcrumb.
 * @prop {string} listClass - CSS classes applied to each breadcrumb list item.
 * @prop {string} containerClass - CSS classes applied to the outer `<ul>` container.
 *
 * @remarks
 * - This component splits the pathname by "/" and maps through every second segment
 *   (e.g., `/applications/_id/entities/_id/accounts`) to build meaningful breadcrumb steps.
 * - It limits rendering to a `MAX_PATH_LENGTH` of 6 to avoid excessively deep breadcrumbs.
 * - The breadcrumb labels capitalize the first character and truncate on "-" to simplify resource labels.
 * - The home link always points to the default login redirect path.
 *
 * @returns JSX.Element - A navigable breadcrumb UI.
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/app/routes";

// BREADCRUMBS NAVIGATION

export interface BreadcrumbsNavProps {
  separator: string;
  homeElement: string;
  activeClass: string;
  listClass: string;
  containerClass: string;
}

// Maximum path segments to render in breadcrumbs
const MAX_PATH_LENGTH = 6;

export default function BreadcrumbsNav({
  separator = "&rarr;",
  homeElement,
  activeClass,
  listClass,
  containerClass,
}: BreadcrumbsNavProps) {
  const path = usePathname();
  // Example path: "/applications/_id/entities/_id/accounts/_id/resources"
  const pathNames = path.split("/").filter((path) => path);

  return (
    <nav aria-label="breadcrumb-navigation">
      <ul className={containerClass}>
        {/* Home element always shown */}
        <li className={listClass}>
          <Link href={DEFAULT_LOGIN_REDIRECT}>{homeElement}</Link>
        </li>

        {pathNames.length > 0 && " " + separator}

        {pathNames.map((pathName, index) => {
          // Render only even-indexed path segments up to the max allowed depth
          if (index % 2 === 0 && index <= MAX_PATH_LENGTH) {
            const crumbHref = "/" + pathNames.slice(0, index + 1).join("/");
            const isActive = path === crumbHref || index === MAX_PATH_LENGTH;
            const crumbClass = isActive
              ? `${listClass} ${activeClass}`
              : listClass;

            // Capitalize and truncate label at "-" for simplified label display
            const crumbLabel =
              pathName[0].toUpperCase() + pathName.slice(1).split("-")[0];

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
