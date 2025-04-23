import ItemRow from "@/app/_components/ItemRow";

import { ItemContainerProps } from "@/app/_types/types";
import ResourceItem from "./ResourceItem";
import DataDisplayContainer from "./DataDisplayContainer";
import SettingsWindow from "./SettingsWindow";

export default async function ItemsContainer({
  items,
  urlPath,
  resourceId,
  collectionName,
  appId,
  isEdit,
  isSettings,
  managementId,
  currentPage,
}: ItemContainerProps) {
  return (
    <div className="flex w-full h-full">
      {!resourceId || !collectionName ? (
        <ul
          className={`flex flex-col transition-all duration-300 ${
            isSettings ? "w-1/2" : "w-full"
          }`}
        >
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
          collectionName={currentPage}
          appId={appId}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}
