import { getResourceByResourceId } from "@/app/_services/resourcesDataService";
import { appResourceFields } from "@/app/_config/appDataConfigs";
import CardWrapper from "./CardWrapper";
import FormGenerator from "./FormGenerator";
import EditButtonsBar from "./EditButtonsBar";
import { FormElementType } from "@/app/_types/types";
import { updateItem } from "@/app/_services/actions";
import DeleteModal from "./DeleteModal";

// GET FRESH INFORMATION WHEN UPDATE ITEM
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ResourceItemProps {
  collectionName: string;
  resourceId: string;
  appId: string | undefined;
  isEdit: string | undefined;
}

//COMPONENT WORKS WITH DIFFERENT ITEMS AND EACH ITEM CAN HAVE THEIR OWN FIELDS CONFIGURATIONS
async function ResourceItem({
  collectionName,
  resourceId,
  appId,
  isEdit,
}: ResourceItemProps) {
  if (!appId || !(appId in appResourceFields)) return null;

  // GET ITEM RESOURCE FROM DB TO DISPLAY
  const resolvedResourceItems = await getResourceByResourceId(
    collectionName,
    resourceId
  );

  if (!resolvedResourceItems) return null;

  // CONVERT MONGODB RESOLVEDRESOURCEITEMS TO PLAIN OBJECT
  const clientResourceItems = JSON.parse(JSON.stringify(resolvedResourceItems));

  //GET LIST OF COLLECTION OF RESOURCES FROM PRE SET CONFIGURATIONS FOR CURRENT APP TO HAVE ACCESS TO THEIR FIELDS
  const appFieldsByAppId =
    appResourceFields[appId as keyof typeof appResourceFields];

  if (!(collectionName in appFieldsByAppId)) return null;

  //GET OBJECT OF FIELDS OF RESOURCE TO DISPLAY NECESSARY FIELDS IN THE FORM
  const collectionFields =
    appFieldsByAppId[collectionName as keyof typeof appFieldsByAppId];

  // HANDLE FORM SUBMITION TO UPDATE DATA
  async function handleForm(formData: Partial<FormElementType>) {
    "use server";

    try {
      await updateItem(formData, collectionName, resourceId);
    } catch (err) {
      console.error("The Item was not updated." + err);
    }
  }
  return (
    <>
      <CardWrapper>
        <div>
          <CardWrapper.CardLabel>
            {collectionName[0].toUpperCase() + collectionName.slice(1)} info -{" "}
            {clientResourceItems.name}
          </CardWrapper.CardLabel>
          <CardWrapper.CardContent>
            <FormGenerator
              key={JSON.stringify(clientResourceItems)}
              formFields={collectionFields}
              onSubmit={handleForm}
              defaultValues={clientResourceItems}
              isCompactForm={false}
              isEdit={!!isEdit}
              formId="resource-edit"
            />
          </CardWrapper.CardContent>
        </div>
        <CardWrapper.CardButtons>
          {isEdit && (
            <DeleteModal id={resourceId} collectionName={collectionName} />
          )}
        </CardWrapper.CardButtons>
      </CardWrapper>
      <EditButtonsBar formId="resource-edit" />
    </>
  );
}

export default ResourceItem;
