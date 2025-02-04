"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface Item {
  id: string;
  icon?: string;
  name: string;
}
interface ItemRowProps {
  //items (array of objects with information from db)
  items: Item[];
  // urlPath - part of url which has to be added to the url
  urlPath: string;
}

export default function ItemRow({ items, urlPath }: ItemRowProps) {
  const path = usePathname();
  return (
    <>
      {items.map((item) => (
        <Link
          href={`${urlPath !== "applications" ? path + "/" : ""}${urlPath}/${
            item.id
          }`}
          key={item.id}
        >
          <li className="flex border border-plum-500">
            {item.icon && (
              <Image src={item.icon} alt={item.name} width={32} height={32} />
            )}

            {item.name}
          </li>
        </Link>
      ))}
    </>
  );
}
