import { getManagementDataByManagementId } from "@/app/_services/managementDataService";
import CardWrapper from "./CardWrapper";
import EditButtonsBar from "./EditButtonsBar";
import FormGenerator from "./FormGenerator";
import { appSettingsFields } from "@/app/_config/appSettingsConfigs";
import { ACCOUNT_SETTINGS_SCHEMA } from "@/app/_constants/schema-names";
import { FormElementType } from "@/app/_types/types";
import createZodSchema from "@/app/_lib/validationSchema";
import { updateItem } from "@/app/_services/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function SettingsWindow({
  managementId,
  collectionName,
  appId,
  isEdit,
}: {
  managementId: string | undefined;
  collectionName: string | undefined;
  appId: string | undefined;
  isEdit: string | undefined;
}) {
  if (!managementId || !collectionName) return null;
  const resolvedManagementItem = await getManagementDataByManagementId(
    collectionName,
    managementId
  );
  if (!resolvedManagementItem) return null;
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
  async function handleForm(formData: Partial<FormElementType>) {
    "use server";
    createZodSchema(ACCOUNT_SETTINGS_SCHEMA).safeParse(formData);
    try {
      const settings = { settings: formData };
      if (collectionName && managementId)
        await updateItem(settings, collectionName, managementId, false);
    } catch (err) {
      console.error("The settings were not updated. " + err);
    }
  }
  return (
    <div className="w-1/2 bg-ocean-0 h-full border border-ocean-800">
      <CardWrapper>
        <CardWrapper.CardLabel>
          {collectionName[0].toUpperCase() + collectionName.slice(1)} Settings
        </CardWrapper.CardLabel>
        <CardWrapper.CardContent>
          <FormGenerator
            key={JSON.stringify(settingsObj)}
            formFields={managementSettingsFields}
            onSubmit={handleForm}
            defaultValues={settingsObj}
            isCompactForm={false}
            isEdit={!!isEdit}
            formId="settings-edit"
          />
        </CardWrapper.CardContent>
        <CardWrapper.CardButtons>
          <EditButtonsBar formId="settings-edit" />
        </CardWrapper.CardButtons>
      </CardWrapper>
    </div>
  );
}

export default SettingsWindow;
