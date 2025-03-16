"use client";
import { HiOutlinePlus } from "react-icons/hi2";
import Modal from "./Modal";
import CardWrapper from "./CardWrapper";
import Button from "./Button";
import FormGenerator from "./FormGenerator";
import { registrationFormSchema } from "@/app/_schemas/formSchema";

function ResourceToolboxBar() {
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
              <FormGenerator formSchema={registrationFormSchema} />
            </CardWrapper.CardContent>
            <CardWrapper.CardPopupMessage type="success">
              This Is Popup Message
            </CardWrapper.CardPopupMessage>
            <CardWrapper.CardButtons>
              <Button>Add</Button>
              <Button>Cancel</Button>
            </CardWrapper.CardButtons>
          </CardWrapper>
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default ResourceToolboxBar;
