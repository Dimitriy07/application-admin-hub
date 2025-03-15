"use client";
import { HiOutlinePlus } from "react-icons/hi2";
import Modal from "./Modal";
import CardWrapper from "./CardWrapper";

function ResourceToolboxBar() {
  return (
    <div className="items-center bg-ocean-0 justify-start gap-2">
      <Modal>
        <Modal.Open opens="add-resource">
          <HiOutlinePlus className="text-coral-800 size-6 cursor-pointer" />
        </Modal.Open>
        <Modal.Window name="add-resource">
          <CardWrapper />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default ResourceToolboxBar;
