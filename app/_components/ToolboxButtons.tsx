"use client";

import Modal from "./Modal";
import CardWrapper from "./CardWrapper";
import Button from "./Button";
import FormGenerator from "./FormGenerator";
import {
  generalFormFields,
  registrationFormFields,
} from "@/app/_config/formConfigs";
import { FormConfigWithConditions } from "@/app/_types/types";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { isNotId } from "@/app/_utils/page-validation";
import { Suspense, useMemo, useState } from "react";
import { USER_REGISTRATION_SCHEMA } from "@/app/_constants/validations-schema-names";
import { useButtonFormHandlers } from "@/app/_hooks/useButtonFormHandlers";
import { USERS_COLLECTION } from "@/app/_constants/form-names";
import {
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";

/**
 * ToolboxButtons Component
 *
 * Displays a modal-based "Add" button to create a new resource or item.
 * Determines which form to display based on the current `resourceType` or URL path.
 * Wraps the form inside a modal window and handles submission, success and error states.
 *
 * @component
 * @param {Object} props
 * @param {boolean | null} [props.disabled] - If true, disables the add button.
 * @returns {JSX.Element}
 */
function ToolboxButtons({ disabled }: { disabled?: boolean | null }) {
  /** Stores success message after form submission */
  const [success, setSuccess] = useState<string | undefined>();

  /** Stores error message after form submission */
  const [error, setError] = useState<string | undefined>();

  /**
   * Route parameters for contextual references (e.g., app, entity, or account ID)
   */
  const {
    [DB_REFERENCE_TO_COL1]: refIdToCollectionLevel1,
    [DB_REFERENCE_TO_COL2]: refIdToCollectionLevel2,
    [DB_REFERENCE_TO_COL3]: refIdToCollectionLevel3,
  } = useParams<{
    [DB_REFERENCE_TO_COL1]: string;
    [DB_REFERENCE_TO_COL2]: string;
    [DB_REFERENCE_TO_COL3]: string;
  }>();

  const path = usePathname();
  const searchParams = useSearchParams();

  /** Type of resource being managed (e.g., users) */
  const resourceType = searchParams.get("resourceType");

  /** Indicates whether the form is dirty (i.e., has unsaved changes) */
  const isDirty = searchParams.get("isDirty");

  /**
   * Extracts the current page name from the URL path (used to determine DB collection name)
   */
  const pageName = useMemo(() => path.split("/").at(-1), [path])!;

  /**
   * Validates that the page name is not an ID (used to avoid confusion with dynamic route segments)
   */
  const isPageNameValid = useMemo(() => isNotId(pageName), [pageName]);

  /**
   * Hook returns handlers for either user registration or general item addition
   */
  const { handleUserRegistration, handleItemAddition } = useButtonFormHandlers({
    pageName,
    resourceType,
    refIdToCollectionLevel1,
    refIdToCollectionLevel2,
    refIdToCollectionLevel3,
    isPageNameValid,
    setError,
    setSuccess,
  });

  /**
   * Determines the appropriate form configuration (fields, validation schema, and handler)
   * based on the current `resourceType`.
   */
  const formConfig = useMemo(() => {
    if (resourceType === USERS_COLLECTION) {
      return {
        fields: registrationFormFields,
        schema: USER_REGISTRATION_SCHEMA,
        submitHandler: handleUserRegistration,
      };
    }
    return {
      fields: generalFormFields,
      submitHandler: handleItemAddition,
    };
  }, [resourceType, handleItemAddition, handleUserRegistration]);

  return (
    <Suspense>
      <Modal>
        {/* Open trigger button */}
        {!disabled && (
          <Modal.Open opens="add-resource">
            <Button size="small" variation="primary">
              {resourceType ? "Add Resource" : "Add Item"}
            </Button>
          </Modal.Open>
        )}

        {/* Modal content */}
        <Modal.Window name="add-resource">
          <CardWrapper>
            {/* Modal label */}
            <CardWrapper.CardLabel>
              {resourceType
                ? `ADD TO "${resourceType.toUpperCase()}" ITEM`
                : `ADD TO "${pageName.toUpperCase()}" ITEM`}
            </CardWrapper.CardLabel>

            {/* Form area */}
            <CardWrapper.CardContent>
              <FormGenerator
                formFields={formConfig.fields as FormConfigWithConditions}
                onSubmit={formConfig.submitHandler}
                formId="item-form"
                validationSchema={formConfig.schema}
                isEdit={true}
              />
            </CardWrapper.CardContent>

            {/* Display success or error message if present */}
            {success || error ? (
              <CardWrapper.CardMessage type={success ? "success" : "error"}>
                {success || error || ""}
              </CardWrapper.CardMessage>
            ) : null}

            {/* Action buttons */}
            <CardWrapper.CardButtons>
              <Button type="submit" form="item-form" disabled={!isDirty}>
                Add
              </Button>
              <Button
                variation="secondary"
                isModalClose={true}
                onClick={() => {
                  setError("");
                  setSuccess("");
                }}
              >
                Cancel
              </Button>
            </CardWrapper.CardButtons>
          </CardWrapper>
        </Modal.Window>
      </Modal>
    </Suspense>
  );
}

export default ToolboxButtons;
