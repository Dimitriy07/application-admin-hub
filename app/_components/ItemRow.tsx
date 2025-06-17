"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ItemRowProps } from "@/app/_types/types";

/**
 * ItemRow Component
 *
 * Renders a single item row within a list, supporting icons, roles, selection state,
 * conditional settings toggle, and dynamic navigation via query parameters.
 *
 * @component
 * @param {ItemRowProps} props
 * @param {Object} props.item - Item data (id, name, icon?, role?).
 * @param {string} props.urlPath - The URL path segment used for navigation.
 * @param {string} [props.collectionName] - If defined, switches routing behavior to resource-based links.
 * @param {boolean} [props.hasSettings=false] - If true, displays a settings button.
 *
 * @returns {JSX.Element} Rendered item row element.
 */
export default function ItemRow({
  item,
  urlPath,
  collectionName,
  hasSettings,
}: ItemRowProps): JSX.Element {
  /** Local state for toggling the settings button */
  const [displaySettings, setDisplaySettings] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Memoized version of search parameters for manipulation and reactivity.
   */
  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  /** Detect if the current view is a "users" resource app */
  const isUser = searchParams.get("resourceType");

  /** Determines if this item is currently selected (based on managementId in the query string) */
  const isSelected = item.id === params.get("managementId");

  /**
   * Resets the URL route if the settings flag is false and a managementId is present,
   * effectively collapsing the settings view.
   */
  useEffect(() => {
    if (params.get("settings") === "false" && params.get("managementId")) {
      router.replace(`${pathname}`);
    }
  }, [params, pathname, router]);

  /**
   * Computes the navigation href dynamically based on whether it's
   * a resource-type link (collectionName present) or a standard item link.
   */
  let href: string;
  if (!collectionName)
    href = `${urlPath !== "applications" ? pathname + "/" : ""}${
      item.id
    }/${urlPath}`;
  else
    href = `${pathname}/?resourceType=${collectionName}&resourceId=${item.id}`;

  return (
    <li
      className={`flex border rounded-md hover:-translate-y-[1px] hover:shadow-md justify-between items-center px-2 ${
        isSelected && "-translate-y-[1px] shadow-md"
      }`}
    >
      {/* Main clickable area leading to the item-specific URL */}
      <Link href={href} className="w-full">
        <div className={`flex items-center ${isUser && "justify-between"}`}>
          {/* Optional icon image for the item */}
          {item.icon && (
            <Image
              src={item.icon}
              alt={item.name}
              width={32}
              height={32}
              aria-label={`Icon for ${item.name}`}
            />
          )}

          {/* Display item name */}
          <span>{item.name}</span>

          {/* If the item is a user-type entity, show their role */}
          {isUser && (
            <p
              className={`${
                item.role === "admin" ? "bg-plum-800" : "bg-rosewood-800"
              } px-1 mx-2 rounded-lg text-ocean-0 self-center`}
            >
              {item.role}
            </p>
          )}
        </div>
      </Link>

      {/* Optional settings button (visible if hasSettings and not in collectionName mode) */}
      {!collectionName && hasSettings && (
        <button
          className="m-1 border rounded-sm w-6 flex justify-center items-center h-6 hover:bg-coral-500 hover:text-coral-0"
          onClick={() => {
            const toggledValue = !displaySettings;

            // If already opened on a different item, force replace
            if (
              searchParams.get("settings") &&
              searchParams.get("managementId") !== item.id
            ) {
              setDisplaySettings(true);
              router.replace(`?settings=${true}&managementId=${item.id}`);
            } else {
              setDisplaySettings(toggledValue);
              router.push(`?settings=${toggledValue}&managementId=${item.id}`);
            }
          }}
        >
          <HiOutlineCog6Tooth />
        </button>
      )}
    </li>
  );
}
