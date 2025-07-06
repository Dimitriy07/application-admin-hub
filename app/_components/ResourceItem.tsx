import CardWrapper from "./CardWrapper";
import DeleteModal from "./DeleteModal";
import EditButtonsBar from "./EditButtonsBar";
import FormGenerator from "./FormGenerator";

import { updateItem } from "@/app/_services/actions";
import { getResourceByResourceId } from "@/app/_services/data-service/resourcesDataService";
import { getAppConfig } from "@/app/_config/getAppConfig";

import { FormConfigWithConditions } from "@/app/_types/types";

// Instructs Next.js to always render this component on the server (no caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ResourceItemProps {
  /** Name of the resource collection in the database (e.g., "users", "vehicles") */
  collectionName: string;
  /** ID of the resource to be fetched and displayed */
  resourceId: string;
  /** App identifier used to determine configuration schema */
  refIdToCollectionLevel1: string | undefined;
  /** Whether the form is in edit mode (typically derived from query param) */
  isEdit: string | undefined;
}

/**
 * ResourceItem Component
 *
 * Dynamically renders a form and detail view for a single resource item.
 * Uses a configuration schema based on the `refIdToCollectionLevel1` to determine which fields to show.
 * Handles both read-only and edit modes, as well as deletion if allowed.
 *
 * @param {ResourceItemProps} props - Props to identify and configure the resource view
 * @returns {Promise<JSX.Element | null>} Form with item data or null if data/config is invalid
 */
async function ResourceItem({
  collectionName,
  resourceId,
  refIdToCollectionLevel1,
  isEdit,
}: ResourceItemProps) {
  // Skip rendering if `refIdToCollectionLevel1` is not available
  if (!refIdToCollectionLevel1) return null;

  // Get form configuration schema based on the app context
  const config = await getAppConfig(refIdToCollectionLevel1);
  const resourceConfig = config?.resourceConfig;

  // Fetch the resource item from the database
  const resolvedResourceItems = await getResourceByResourceId(
    collectionName,
    resourceId
  );

  // Validate that both resource and config are available
  if (!resolvedResourceItems || !resourceConfig) return null;

  // Serialize the MongoDB document into a plain object for the client
  const clientResourceItems = JSON.parse(JSON.stringify(resolvedResourceItems));

  // Skip rendering if the collection does not exist in the config
  if (!(collectionName in resourceConfig)) return null;

  // Extract the form field definitions for the given collection
  const collectionFields =
    resourceConfig[collectionName as keyof typeof resourceConfig];

  /**
   * Form submit handler for updating the resource
   *
   * @param {Record<string, string>} formData - Modified form data to be saved
   */
  async function handleForm(formData: Record<string, string>) {
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
              key={JSON.stringify(clientResourceItems)} // Ensures re-render on value change
              formFields={collectionFields as FormConfigWithConditions}
              onSubmit={handleForm}
              defaultValues={clientResourceItems}
              isCompactForm={false}
              isEdit={!!isEdit}
              formId="resource-edit"
            />
          </CardWrapper.CardContent>
        </div>

        <CardWrapper.CardButtons>
          {/* Show delete button only in edit mode */}
          {isEdit && (
            <DeleteModal id={resourceId} collectionName={collectionName} />
          )}
        </CardWrapper.CardButtons>
      </CardWrapper>

      {/* Sticky footer with Save/Cancel buttons */}
      <EditButtonsBar formId="resource-edit" />
    </>
  );
}

export default ResourceItem;
