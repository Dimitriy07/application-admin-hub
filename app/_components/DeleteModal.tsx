"use client";
import Modal from "./Modal";
import Button from "./Button";
import CardWrapper from "./CardWrapper";
import { deleteItem } from "@/app/_services/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DeleteModal({
  id,
  collectionName,
  isResource = true,
  referenceToCol,
}: {
  id: string;
  collectionName: string;
  isResource?: boolean;
  referenceToCol?: string;
}) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const path = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  async function handleDelete() {
    const result = await deleteItem(
      collectionName,
      id,
      referenceToCol,
      isResource
    );
    if ("error" in result) {
      setError(result.error || "");
    } else if ("message" in result) {
      setSuccess(result.message);
      const resourceType = params.get("resourceType");
      router.replace(
        `${path}${isResource ? "?resourceType=" + resourceType : ""}`
      );
    } else {
      const resourceType = params.get("resourceType");
      router.replace(
        `${path}${isResource ? "?resourceType=" + resourceType : ""}`
      );
    }
  }
  return (
    <Modal>
      <Modal.Open opens="delete">
        <Button variation="danger" size="small">
          Delete
        </Button>
      </Modal.Open>
      <Modal.Window isOutsideClickEnabled={true} name="delete">
        <CardWrapper>
          <CardWrapper.CardContent>
            <p>Do you really want to delete this Item?</p>
          </CardWrapper.CardContent>
          {error || success ? (
            <CardWrapper.CardPopupMessage type={error ? "error" : "success"}>
              {error ? error : success}
            </CardWrapper.CardPopupMessage>
          ) : null}
          <CardWrapper.CardButtons>
            <Button onClick={handleDelete} variation="danger">
              Delete
            </Button>
            <Button isModalClose={true} variation="secondary">
              No
            </Button>
          </CardWrapper.CardButtons>
        </CardWrapper>
      </Modal.Window>
    </Modal>
  );
}
