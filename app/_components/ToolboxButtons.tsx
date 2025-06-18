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
import { USER_REGISTRATION_SCHEMA } from "@/app/_constants/schema-names";
import { useButtonFormHandlers } from "../_hooks/useButtonFormHandlers";

function ToolboxButtons({ disabled }: { disabled?: boolean | null }) {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  // GET MANAGEMENT ITEM ID IS USED FOR CURRENT USER AND RENAME IT TO GENERAL NAME
  const {
    appId: refToIdCollection1,
    entityId: refToIdCollection2,
    accountId: refToIdCollection3,
  } = useParams<{
    appId: string;
    entityId: string;
    accountId: string;
  }>();
  // GET PATH AND QUERY PARAMS "RESOURCE TYPE" NAME

  const path = usePathname();
  const searchParams = useSearchParams();
  const resourceType = searchParams.get("resourceType");
  const isDirty = searchParams.get("isDirty");

  // AS LAST NAME EITHER NAME OF THE MANAGEMENT ITEM OR QUERY PARAMS, GET LAST PART OF URL AS THE INDICATOR WHAT PAGE AND COLLECTION IN DB HAS TO BE USED TO MANIPULATE WITH DATA
  const pageName = useMemo(() => path.split("/").at(-1), [path])!;

  // CHECK IF PAGENAME IS VALID WORD SO IT IS NOT ID
  const isPageNameValid = useMemo(() => isNotId(pageName), [pageName]);

  const { handleUserRegistration, handleItemAddition } = useButtonFormHandlers({
    pageName,
    resourceType,
    refToIdCollection1,
    refToIdCollection2,
    refToIdCollection3,
    isPageNameValid,
    setError,
    setSuccess,
  });

  const formConfig = useMemo(() => {
    if (resourceType === "users") {
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
        {!disabled && (
          <Modal.Open opens="add-resource">
            <Button size="small" variation="primary">
              {resourceType ? "Add Resource" : "Add Item"}
            </Button>
          </Modal.Open>
        )}
        <Modal.Window name="add-resource">
          <CardWrapper>
            <CardWrapper.CardLabel>
              {resourceType
                ? `ADD TO "${resourceType.toUpperCase()}" ITEM`
                : `ADD TO "${pageName.toUpperCase()}" ITEM`}
            </CardWrapper.CardLabel>
            <CardWrapper.CardContent>
              <FormGenerator
                formFields={formConfig.fields as FormConfigWithConditions}
                onSubmit={formConfig.submitHandler}
                formId="item-form"
                validationSchema={formConfig.schema}
                isEdit={true}
              />
            </CardWrapper.CardContent>
            {success || error ? (
              <CardWrapper.CardMessage type={success ? "success" : "error"}>
                {success || error || ""}
              </CardWrapper.CardMessage>
            ) : null}
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
