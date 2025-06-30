import ItemRow from "@/app/_components/ItemRow";

import { ItemContainerProps } from "@/app/_types/types";
import ResourceItem from "./ResourceItem";
import DataDisplayContainer from "./DataDisplayContainer";
import SettingsWindow from "./SettingsWindow";
import { DB_COLLECTION_LEVEL3 } from "@/app/_constants/mongodb-config";

export default async function ItemsContainer({
  items,
  urlPath,
  refIdToCollectionLevel1,
  managementId,
  resourceId,
  collectionName,
  isEdit,
  isSettings,
  currentCollection,
  query,
  userRole,
  refNameToCollection,
}: ItemContainerProps) {
  let filteredItems;
  if (!query) filteredItems = items;
  else {
    filteredItems = items.filter((item) =>
      item.name?.toLowerCase().includes(query)
    );
  }

  // SETTINGS CAN BE SHOWN FOR SUPERADMIN OR IN COLLECTION LEVEL3 FOR ADMIN
  const isAuthorized =
    (userRole === "admin" && currentCollection === DB_COLLECTION_LEVEL3) ||
    userRole === "superadmin";

  let hasSettings = false;

  if (refIdToCollectionLevel1 && currentCollection) {
    if (isAuthorized) {
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
            refIdToCollectionLevel1={refIdToCollectionLevel1}
            isEdit={isEdit}
          />
        </DataDisplayContainer>
      )}
      {isSettings && (
        <SettingsWindow
          isAuthorized={isAuthorized}
          managementId={managementId}
          collectionName={currentCollection}
          refIdToCollectionLevel1={refIdToCollectionLevel1}
          isEdit={isEdit}
          refNameToCollection={refNameToCollection}
        />
      )}
    </div>
  );
}
