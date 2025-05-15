import ItemRow from "@/app/_components/ItemRow";

import { ItemContainerProps } from "@/app/_types/types";
import ResourceItem from "./ResourceItem";
import DataDisplayContainer from "./DataDisplayContainer";
import SettingsWindow from "./SettingsWindow";
import { appSettingsFields } from "@/app/_config/appSettingsConfigs";

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
  type AppId = keyof typeof appSettingsFields;

  let filteredItems;
  if (!query) filteredItems = items;
  else {
    filteredItems = items.filter((item) =>
      item.name?.toLowerCase().includes(query)
    );
  }

  let hasSettings = false;
  if (appId && currentCollection) {
    if (
      appSettingsFields[appId as AppId] &&
      currentCollection in appSettingsFields[appId as AppId]
    ) {
      hasSettings = true;
    }
  }
  return (
    <div className="flex w-full h-[calc(100%-40px)]">
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
              hasSettings={hasSettings}
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
