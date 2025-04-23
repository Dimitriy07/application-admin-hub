"use client";

import Modal from "./Modal";
import CardWrapper from "./CardWrapper";
import Button from "./Button";
import FormGenerator from "./FormGenerator";
import {
  generalFormFields,
  registrationFormFields,
} from "@/app/_config/formConfigs";
import { FormElementType } from "@/app/_types/types";
import createZodSchema from "@/app/_lib/validationSchema";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { addItem, register } from "@/app/_services/actions";
import { isNotId } from "@/app/_utils/pageValidation";
import { Suspense, useCallback, useMemo, useState } from "react";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";
import {
  ADD_ITEM_SCHEMA,
  USER_REGISTRATION_SCHEMA,
} from "@/app/_constants/schema-names";

function ToolboxButtons() {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const router = useRouter();
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

  // AS LAST NAME EITHER NAME OF THE MANAGEMENT ITEM OR QUERY PARAMS, GET LAST PART OF URL AS THE INDICATOR WHAT PAGE AND COLLECTION IN DB HAS TO BE USED TO MANIPULATE WITH DATA
  const pageName = useMemo(() => path.split("/").at(-1), [path])!;

  // CHECK IF PAGENAME IS VALID WORD SO IT IS NOT ID
  const isPageNameValid = useMemo(() => isNotId(pageName), [pageName]);

  //HANDLE USER FORM SEPARATELY FROM OTHER DATA MANIPULATION
  const handleUserRegistration = useCallback(
    async (formData: Partial<FormElementType>) => {
      const result = createZodSchema(USER_REGISTRATION_SCHEMA).safeParse(
        formData
      );
      if (!result.success)
        return setError(`Validation failed: ${result.error}`);

      await register(
        {
          ...result.data,
          refToIdCollection2,
          refToIdCollection3,
        },
        resourceType!
      );
      setSuccess("User is added");
      router.refresh();
    },
    [resourceType, refToIdCollection2, refToIdCollection3, router]
  );

  // HANDLE FORM OTHER FROM USER FORM
  const handleItemAddition = useCallback(
    async (formData: Partial<FormElementType>) => {
      const result = createZodSchema(ADD_ITEM_SCHEMA).safeParse(formData);
      if (!result.success)
        return setError(`Validation failed: ${result.error}`);

      try {
        let refToCollectionName, refToIdCollection;

        if (resourceType) {
          refToCollectionName = DB_REFERENCE_TO_COL3;
          refToIdCollection = refToIdCollection3;
        } else {
          switch (pageName) {
            case DB_COLLECTION_LEVEL2:
              refToCollectionName = DB_REFERENCE_TO_COL1;
              refToIdCollection = refToIdCollection1;
              break;
            case DB_COLLECTION_LEVEL3:
              refToCollectionName = DB_REFERENCE_TO_COL2;
              refToIdCollection = refToIdCollection2;
              break;
            default:
              return setError("Invalid collection reference");
          }
        }

        if (!isPageNameValid || !refToCollectionName)
          return setError("Invalid collection reference");

        const item = await addItem(
          { ...result.data, refToIdCollection },
          resourceType ? resourceType : pageName,
          refToCollectionName,
          !!resourceType
        );
        if (item.success) setSuccess(item.message);
        router.refresh();
      } catch (err) {
        setError(`Item hasn't been added: ${err}`);
      }
    },
    [
      pageName,
      resourceType,
      refToIdCollection1,
      refToIdCollection2,
      refToIdCollection3,
      isPageNameValid,
      router,
    ]
  );

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
      schema: ADD_ITEM_SCHEMA,
      submitHandler: handleItemAddition,
    };
  }, [resourceType, handleItemAddition, handleUserRegistration]);
  return (
    <Suspense>
      <Modal>
        <Modal.Open opens="add-resource">
          <Button size="small" variation="primary">
            {resourceType ? "Add Resource" : "Add Item"}
          </Button>
        </Modal.Open>
        <Modal.Window name="add-resource">
          <CardWrapper>
            <CardWrapper.CardLabel>
              {resourceType
                ? `ADD TO "${resourceType.toUpperCase()}" ITEM`
                : `ADD TO "${pageName.toUpperCase()}" ITEM`}
            </CardWrapper.CardLabel>
            <CardWrapper.CardContent>
              <FormGenerator
                formFields={formConfig.fields}
                onSubmit={formConfig.submitHandler}
                formId="item-form"
                validationSchema={formConfig.schema}
                isEdit={true}
              />
            </CardWrapper.CardContent>
            {success || error ? (
              <CardWrapper.CardPopupMessage
                type={success ? "success" : "error"}
              >
                {success || error || ""}
              </CardWrapper.CardPopupMessage>
            ) : null}
            <CardWrapper.CardButtons>
              <Button type="submit" form="item-form">
                Add
              </Button>
              <Button
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
