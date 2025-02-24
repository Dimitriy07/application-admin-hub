"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ItemRowProps } from "@/app/_types/types";
/**
 * Props for the `ItemRow` component.
 *
 * @typedef {Object} ItemRowProps
 * @property {Item | DynamicResourceItem} item - An object containing information about the item. This includes `id`, `name`, and dynamic fields.
 * @property {string} urlPath - (optional) A string representing the URL path segment to be appended to the base URL for navigation.
 */

/**
 * A component that renders a single item row with a link.
 *
 * This component takes an `item` object and a `urlPath` string, and renders a clickable list item (`li`).
 * The `urlPath` is used to construct the navigation URL dynamically. If the `urlPath` is not "applications",
 * the current pathname is included in the URL. The item's `icon` (if available) and `name` are displayed.
 *
 * @param {ItemRowProps} props - The props for the `ItemRow` component.
 * @param {Item | DynamicResourceItem} props.item - The item object containing `id`, `name`, and dynamic fields.
 * @param {string} props.urlPath - (optional) The URL path segment to append for navigation.
 * @returns {JSX.Element} A `Link` component wrapping an `li` element that displays the item's icon and name.
 */
export default function ItemRow({ item, urlPath }: ItemRowProps) {
  const pathname = usePathname();

  return (
    <>
      <Link
        href={`${urlPath !== "applications" ? pathname + "/" : ""}${
          item.id
        }/${urlPath}`}
      >
        <li className="flex border border-plum-500 hover:-translate-y-[1px]">
          {item.icon && (
            <Image
              src={item.icon}
              alt={item.name}
              width={32}
              height={32}
              aria-label={`Icon for ${item.name}`}
            />
          )}
          {item.name}
        </li>
      </Link>
    </>
  );
}
