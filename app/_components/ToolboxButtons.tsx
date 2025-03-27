"use client";

import Modal from "./Modal";
import CardWrapper from "./CardWrapper";
import Button from "./Button";
import FormGenerator from "./FormGenerator";
import {
  generalFormFields,
  registrationFormFields,
} from "@/app/_config/formConfigs";
import { FormElement } from "@/app/_types/types";
import {
  addItemSchema,
  userRegistrationSchema,
} from "@/app/_lib/validationSchema";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { addItem, register } from "@/app/_services/actions";
import { isNotId } from "@/app/_utils/pageValidation";
import { useCallback, useMemo, useState } from "react";
import {
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";

function ToolboxButtons() {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const router = useRouter();
  const {
    appId: refToIdCollection1,
    entityId: refToIdCollection2,
    accountId: refToIdCollection3,
  } = useParams<{
    appId: string;
    entityId: string;
    accountId: string;
  }>();
  const path = usePathname();
  const searchParams = useSearchParams();
  const resourceType = searchParams.get("resourceType");

  const pageName = useMemo(() => path.split("/").at(-1), [path])!;
  console.log(pageName);
  const isPageNameValid = useMemo(() => isNotId(pageName), [pageName]);

  const handleUserRegistration = useCallback(
    async (formData: FormElement) => {
      const result = userRegistrationSchema.safeParse(formData);
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

  const handleItemAddition = useCallback(
    async (formData: FormElement) => {
      const result = addItemSchema.safeParse(formData);
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
        await addItem(
          { ...result.data, refToIdCollection },
          resourceType ? resourceType : pageName,
          refToCollectionName,
          !!resourceType
        );
        setSuccess("Item added to database!");
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
        schema: userRegistrationSchema,
        submitHandler: handleUserRegistration,
      };
    }
    return {
      fields: generalFormFields,
      schema: addItemSchema,
      submitHandler: handleItemAddition,
    };
  }, [resourceType, handleItemAddition, handleUserRegistration]);
  return (
    <>
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
                ? `Add Item to ${resourceType} collection`
                : `Add Item to ${pageName} collection`}
            </CardWrapper.CardLabel>
            <CardWrapper.CardContent>
              <FormGenerator
                formFields={formConfig.fields}
                onSubmit={formConfig.submitHandler}
                formId="item-form"
                validationSchema={formConfig.schema}
              />
            </CardWrapper.CardContent>
            <CardWrapper.CardPopupMessage type={success ? "success" : "error"}>
              {success || error || ""}
            </CardWrapper.CardPopupMessage>
            <CardWrapper.CardButtons>
              <Button type="submit" form="item-form">
                Add
              </Button>
              <Button isModal={true} onClick={close}>
                Cancel
              </Button>
            </CardWrapper.CardButtons>
          </CardWrapper>
        </Modal.Window>
      </Modal>
    </>
  );
}

export default ToolboxButtons;
