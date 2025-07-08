import CardWrapper from "./CardWrapper";
import DeleteModal from "./DeleteModal";
import EditButtonsBar from "./EditButtonsBar";
import FormGenerator from "./FormGenerator";
import ResourcesMessage from "./ResourcesMessage";

import { updateItem } from "@/app/_services/actions";
import { getManagementDataByManagementId } from "@/app/_services/data-service/managementDataService";
import { getAppConfig } from "@/app/_config/getAppConfig";

// Ensure the page is server-rendered and never statically cached
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SettingsWindowProps {
  /** ID of the management-level item to retrieve */
  managementId: string | undefined;
  /** Name of the collection (e.g., teams, drivers) */
  collectionName: string | undefined;
  /** App identifier used to resolve form schema */
  refIdToCollectionLevel1: string | undefined;
  /** If truthy, shows form in editable mode */
  isEdit: string | undefined;
  /** If true, allows user access to settings */
  isAuthorized: boolean | undefined;
  /** Optional: parent collection name for reference when deleting */
  refNameToCollection?: string;
}

/**
 * SettingsWindow Component
 *
 * Displays a dynamic form for editing a management-level item's settings.
 * - Form structure and fields are derived from a per-app configuration.
 * - Access is gated by the `isAuthorized` flag.
 * - Supports update and delete operations.
 *
 * @component
 * @param {SettingsWindowProps} props
 * @returns {Promise<JSX.Element | null>} Rendered settings form or null if input is invalid
 */
async function SettingsWindow({
  managementId,
  collectionName,
  refIdToCollectionLevel1,
  isEdit,
  isAuthorized,
  refNameToCollection,
}: SettingsWindowProps) {
  // Abort if required data is missing
  if (!managementId || !collectionName) return null;

  // Fetch item from DB
  const resolvedManagementItem = await getManagementDataByManagementId(
    collectionName,
    managementId
  );

  // Validate item and refIdToCollectionLevel1
  if (
    !resolvedManagementItem ||
    "error" in resolvedManagementItem ||
    !refIdToCollectionLevel1
  )
    return null;

  // Extract `settings` field from document
  const settingsObj = resolvedManagementItem?.settings;

  // Retrieve per-app configuration
  const config = await getAppConfig(refIdToCollectionLevel1);

  // Get global settings schema from config or empty object if no special settings
  const appSettingsFields = config?.settings || {};

  // Get schema specific to this collection
  const managementSettingsFields =
    appSettingsFields[collectionName as keyof typeof appSettingsFields];

  /**
   * Handles form submission by updating the settings object in the DB.
   *
   * @param {Record<string, string>} formData - Form values submitted
   */
  async function handleForm(formData: Record<string, string>) {
    "use server";
    try {
      const settings = { settings: formData };
      if (collectionName && managementId) {
        await updateItem(settings, collectionName, managementId, false);
      }
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
              {/* Render settings form only if user is authorized and fields exist */}
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

              {/* Show fallback message if no field config available */}
              {!managementSettingsFields && (
                <ResourcesMessage message='Click "Edit" button to delete an Item' />
              )}

              {/* Show delete button in edit mode */}
              {isEdit && (
                <DeleteModal
                  id={managementId}
                  collectionName={collectionName}
                  isResource={false}
                  refNameToCollection={refNameToCollection}
                />
              )}
            </CardWrapper.CardContent>
          </div>

          {/* Action buttons (Save, Cancel) */}
          <CardWrapper.CardButtons>
            <EditButtonsBar formId="settings-edit" />
          </CardWrapper.CardButtons>
        </div>
      </CardWrapper>
    </div>
  );
}

export default SettingsWindow;
