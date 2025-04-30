import ItemRow from "@/app/_components/ItemRow";

import { ItemContainerProps } from "@/app/_types/types";
import ResourceItem from "./ResourceItem";
import DataDisplayContainer from "./DataDisplayContainer";
import SettingsWindow from "./SettingsWindow";

export default async function ItemsContainer({
  items,
  urlPath,
  appId,
  managementId,
  resourceId,
  collectionName,
  isEdit,
  isSettings,
  currentCollection,
  query,
}: ItemContainerProps) {
  let filteredItems;
  if (!query) filteredItems = items;
  else {
    filteredItems = items.filter((item) =>
      item.name?.toLowerCase().includes(query)
    );
  }
  return (
    <div className="flex w-full h-full">
      {!resourceId || !collectionName ? (
        <ul
          className={`flex flex-col transition-all duration-300 ${
            isSettings ? "w-1/2" : "w-full"
          }`}
        >
          {filteredItems.map((item) => (
            <ItemRow
              item={item}
              urlPath={urlPath}
              key={item.id}
              collectionName={collectionName}
            />
          ))}
        </ul>
      ) : (
        <DataDisplayContainer>
          <ResourceItem
            resourceId={resourceId}
            collectionName={collectionName}
            appId={appId}
            isEdit={isEdit}
          />
        </DataDisplayContainer>
      )}
      {isSettings && (
        <SettingsWindow
          managementId={managementId}
          collectionName={currentCollection}
          appId={appId}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}
