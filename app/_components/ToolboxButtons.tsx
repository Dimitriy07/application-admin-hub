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

interface ToolboxButtonsProps {
  entityId: string;
  accountId: string;
}

function ToolboxButtons({ entityId, accountId }: ToolboxButtonsProps) {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const path = usePathname();
  const searchParams = useSearchParams();
  let pageName: string | undefined;
  const resourceType = searchParams.get("resourceType");
  let formFields;
  let handleSubmit;
  if (resourceType === "users") {
    formFields = registrationFormFields;
    handleSubmit = async (formData: FormElement) => {
      const result = userRegistrationSchema.safeParse(formData);
      if (result.success) {
        await register({ ...result.data, entityId, accountId }, resourceType);

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

    handleSubmit = async (formData: FormElement) => {
      console.log("i am in");
      const result = addItemSchema.safeParse(formData);
      if (result.success) {
        try {
          if (resourceType) {
            await addItem({ ...result.data }, resourceType);
          } else {
            if (!isPageNameValid)
              setError("Wrong format of item collection name!");
            await addItem({ ...result.data }, pageName);
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
                validationSchema={userRegistrationSchema}
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
