import ItemRow from "@/app/_components/ItemRow";

import { ItemContainerProps } from "@/app/_types/types";
import ResourceItem from "./ResourceItem";

export default function ItemsContainer({
  items,
  urlPath,
  resourceId,
  collectionName,
}: ItemContainerProps) {
  return (
    <>
      {!resourceId || !collectionName ? (
        <ul className="flex flex-col">
          {items.map((item) => (
            <ItemRow
              item={item}
              urlPath={urlPath}
              key={item.id}
              collectionName={collectionName}
            />
          ))}
        </ul>
      ) : (
        <ResourceItem resourceId={resourceId} collectionName={collectionName} />
      )}
    </>
  );
}
