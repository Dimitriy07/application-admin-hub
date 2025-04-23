"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ItemRowProps } from "@/app/_types/types";
import { useEffect, useMemo, useState } from "react";

export default function ItemRow({
  item,
  urlPath,
  collectionName,
}: ItemRowProps) {
  const [displaySettings, setDisplaySettings] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  useEffect(
    function () {
      if (params.get("settings") === "false" && params.get("managementId")) {
        router.replace(`${pathname}`);
      }
    },
    [params, pathname, router]
  );

  let href;
  if (!collectionName)
    href = `${urlPath !== "applications" ? pathname + "/" : ""}${
      item.id
    }/${urlPath}`;
  else
    href = `${pathname}/?resourceType=${collectionName}&resourceId=${item.id}`;

  return (
    <li className="flex border border-ocean-600 hover:-translate-y-[1px] justify-between items-center">
      <Link href={href} className="w-full">
        <div className="flex items-center">
          {item.icon && (
            <Image
              src={item.icon}
              alt={item.name}
              width={32}
              height={32}
              aria-label={`Icon for ${item.name}`}
            />
          )}
          <span>{item.name}</span>
        </div>
      </Link>
      {!collectionName && (
        <button
          className="m-1 border border-ocean-800 w-6 flex justify-center items-center h-6 hover:bg-coral-500 hover:text-coral-0"
          onClick={() => {
            const toggledValue = !displaySettings;
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
