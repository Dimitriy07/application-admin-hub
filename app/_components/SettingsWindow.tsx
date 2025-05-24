import { getManagementDataByManagementId } from "@/app/_services/managementDataService";
import CardWrapper from "./CardWrapper";
import EditButtonsBar from "./EditButtonsBar";
import FormGenerator from "./FormGenerator";
import { appSettingsFields } from "@/app/_config/appSettingsConfigs";
import { updateItem } from "@/app/_services/actions";
import DeleteModal from "./DeleteModal";
import ResourcesMessage from "./ResourcesMessage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function SettingsWindow({
  managementId,
  collectionName,
  appId,
  isEdit,
  isAuthorized,
  referenceToCol,
}: {
  managementId: string | undefined;
  collectionName: string | undefined;
  appId: string | undefined;
  isEdit: string | undefined;
  isAuthorized: boolean | undefined;
  referenceToCol?: string;
}) {
  if (!managementId || !collectionName) return null;
  const resolvedManagementItem = await getManagementDataByManagementId(
    collectionName,
    managementId
  );

  if (!resolvedManagementItem || "error" in resolvedManagementItem) return null;

  // GET ACCESS TO SETTINGS OBJECT FROM DB DOCUMENT
  const settingsObj = resolvedManagementItem?.settings;

  //GET LIST OF COLLECTION OF MANAGEMENT DATA FROM PRE SET CONFIGURATIONS FOR CURRENT APP TO HAVE ACCESS TO THEIR FIELDS
  const settingsConfigsByAppId =
    appSettingsFields[appId as keyof typeof appSettingsFields];

  //GET OBJECT OF FIELDS OF MANAGEMENT DATA TO DISPLAY NECESSARY FIELDS IN THE FORM
  const managementSettingsFields =
    settingsConfigsByAppId[
      collectionName as keyof typeof settingsConfigsByAppId
    ];
  // HANDLE FORM SUBMITION TO UPDATE DATA
  async function handleForm(formData: Record<string, string>) {
    "use server";
    // const validatedSettings = createZodSchema(undefined, formData).safeParse(
    //   formData
    // );
    try {
      // const settings = { settings: validatedSettings.data };
      const settings = { settings: formData };
      if (collectionName && managementId)
        await updateItem(settings, collectionName, managementId, false);
    } catch (err) {
      console.error("The settings were not updated. " + err);
    }
  }
  return (
    <div className="w-1/2 bg-ocean-0 h-full border shadow-xl rounded-md">
      <CardWrapper>
        <div className="flex flex-col justify-between h-full">
          <div>
            <CardWrapper.CardLabel>
              {collectionName[0].toUpperCase() + collectionName.slice(1)}{" "}
              Settings - {resolvedManagementItem.name}
            </CardWrapper.CardLabel>
            <CardWrapper.CardContent>
              {isAuthorized && managementSettingsFields && (
                <FormGenerator
                  key={JSON.stringify(settingsObj)}
                  formFields={managementSettingsFields}
                  onSubmit={handleForm}
                  defaultValues={settingsObj}
                  isCompactForm={false}
                  isEdit={!!isEdit}
                  formId="settings-edit"
                />
              )}
              {!managementSettingsFields && (
                <ResourcesMessage message='Click "Edit" button to delete an Item' />
              )}
              {isEdit && (
                <DeleteModal
                  id={managementId}
                  collectionName={collectionName}
                  isResource={false}
                  referenceToCol={referenceToCol}
                />
              )}
            </CardWrapper.CardContent>
          </div>
          <CardWrapper.CardButtons>
            <EditButtonsBar formId="settings-edit" />
          </CardWrapper.CardButtons>
        </div>
      </CardWrapper>
    </div>
  );
}

export default SettingsWindow;
