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
import { usePathname, useSearchParams } from "next/navigation";
import { addItem, register } from "@/app/_services/actions";
import { isId } from "../_utils/pageValidation";
import { useState } from "react";
import {
  DB_COLLECTION_LEVEL1,
  DB_COLLECTION_LEVEL2,
  DB_COLLECTION_LEVEL3,
  DB_REFERENCE_TO_COL1,
  DB_REFERENCE_TO_COL2,
  DB_REFERENCE_TO_COL3,
} from "@/app/_constants/mongodb-config";

interface ToolboxButtonsProps {
  refToIdCollection1: string;
  refToIdCollection2: string;
  refToIdCollection3: string;
}

function ToolboxButtons({
  refToIdCollection1,
  refToIdCollection2,
  refToIdCollection3,
}: ToolboxButtonsProps) {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const path = usePathname();
  const searchParams = useSearchParams();
  let pageName: string | undefined;
  const resourceType = searchParams.get("resourceType");
  let formFields;
  let handleSubmit;
  let validationSchema;
  console.log(refToIdCollection3);
  if (resourceType === "users") {
    formFields = registrationFormFields;
    validationSchema = userRegistrationSchema;
    handleSubmit = async (formData: FormElement) => {
      const result = userRegistrationSchema.safeParse(formData);
      if (result.success) {
        await register(
          { ...result.data, refToIdCollection2, refToIdCollection3 },
          resourceType
        );

        setSuccess("User is added");
      } else {
        setError(`Validation failed: ${result.error}`);
      }
    };
  } else {
    pageName = path.split("/").at(-1);
    if (!pageName) {
      setError("Page URL is not provided");
      return;
    }
    const isPageNameValid = isId(pageName);
    formFields = generalFormFields;
    validationSchema = addItemSchema;
    handleSubmit = async (formData: FormElement) => {
      const result = addItemSchema.safeParse(formData);
      if (result.success) {
        try {
          if (resourceType) {
            await addItem(
              { ...result.data, refToIdCollection: refToIdCollection3 },
              resourceType,
              DB_REFERENCE_TO_COL3,
              true
            );
          } else {
            let refToCollectionName;
            let refToIdCollection;
            switch (pageName) {
              case DB_COLLECTION_LEVEL1:
                break;
              case DB_COLLECTION_LEVEL2:
                refToCollectionName = DB_REFERENCE_TO_COL1;
                refToIdCollection = refToIdCollection1;
                break;
              case DB_COLLECTION_LEVEL3:
                refToCollectionName = DB_REFERENCE_TO_COL2;
                refToIdCollection = refToIdCollection2;
                break;
              default:
                console.error("A management unit for reference was not found.");
            }
            if (!isPageNameValid || refToCollectionName === undefined) {
              setError("Can't find collection name in database");
              return;
            }
            await addItem(
              {
                ...result.data,
                refToIdCollection,
              },
              pageName,
              refToCollectionName,
              false
            );
          }
          setSuccess("Item added to database!");
        } catch (err) {
          setError("Item hasn't been added to database: " + err);
        }
      } else {
        setError(`Validation failed: ${result.error}`);
      }
    };
  }
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
                formFields={formFields}
                onSubmit={handleSubmit}
                formId="item-form"
                validationSchema={validationSchema}
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
