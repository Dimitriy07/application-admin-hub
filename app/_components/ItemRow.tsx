"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ItemRowProps } from "@/app/_types/types";

export default function ItemRow({
  item,
  urlPath,
  collectionName,
}: ItemRowProps) {
  const pathname = usePathname();
  let href;
  if (!collectionName)
    href = `${urlPath !== "applications" ? pathname + "/" : ""}${
      item.id
    }/${urlPath}`;
  else
    href = `${pathname}/?resourceType=${collectionName}&resourceId=${item.id}`;

  return (
    <Link href={href}>
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
  );
}
