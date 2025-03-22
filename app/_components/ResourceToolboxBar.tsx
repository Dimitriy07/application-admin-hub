"use client";
import { HiOutlinePlus } from "react-icons/hi2";
import Modal from "./Modal";
import CardWrapper from "./CardWrapper";
import Button from "./Button";
import FormGenerator from "./FormGenerator";
import { registrationFormFields } from "@/app/_config/formConfigs";
import { FormElement } from "@/app/_types/types";
import { userRegistrationSchema } from "../_lib/validationSchema";
import { useSearchParams } from "next/navigation";
import { register } from "../_services/actions";

interface ResourceToolboxBarProps {
  entityId: string;
  accountId: string;
}

function ResourceToolboxBar({ entityId, accountId }: ResourceToolboxBarProps) {
  const searchParams = useSearchParams();
  const resourceName = searchParams.get("resourceType");

  async function handleSubmit(formData: FormElement) {
    console.log(formData);
    if (resourceName === "users") {
      const result = userRegistrationSchema.safeParse(formData);
      if (result.success) {
        // const { email, name, password, role } = formData;

        const newUser = await register(
          { ...result.data, entityId, accountId },
          resourceName
        );
        console.log(newUser);
      } else {
        return { error: `Validation failed: ${result.error}` };
      }
    }
  }

  return (
    <div className="items-center bg-ocean-0 justify-start gap-2">
      <Modal>
        <Modal.Open opens="add-resource">
          <HiOutlinePlus className="text-coral-800 size-6 cursor-pointer" />
        </Modal.Open>
        <Modal.Window name="add-resource">
          <CardWrapper>
            <CardWrapper.CardLabel>ADD NEW USER</CardWrapper.CardLabel>
            <CardWrapper.CardContent>
              <FormGenerator
                formSchema={registrationFormFields}
                onSubmit={handleSubmit}
                formId="registration-form"
                validationSchema={userRegistrationSchema}
              />
            </CardWrapper.CardContent>
            <CardWrapper.CardPopupMessage type="success">
              This Is Popup Message
            </CardWrapper.CardPopupMessage>
            <CardWrapper.CardButtons>
              <Button type="submit" form="registration-form">
                Add
              </Button>
              <Button>Cancel</Button>
            </CardWrapper.CardButtons>
          </CardWrapper>
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default ResourceToolboxBar;
