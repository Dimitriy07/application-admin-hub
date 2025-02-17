"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Item } from "@/app/_types/types";

interface ItemRowProps {
  //items (array of objects with information from db)
  item: Item;
  // urlPath - part of url which has to be added to the url
  urlPath: string;
}

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
            <Image src={item.icon} alt={item.name} width={32} height={32} />
          )}

          {item.name}
        </li>
      </Link>
    </>
  );
}
