"use client";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "./Button";
import CardWrapper from "./CardWrapper";
import Modal from "./Modal";
import { deleteItem } from "@/app/_services/actions";

type DeleteModalProps = {
  id: string;
  collectionName: string;
  isResource?: boolean;
  refNameToCollection?: string;
};

export default function DeleteModal({
  id,
  collectionName,
  isResource = true,
  refNameToCollection,
}: DeleteModalProps) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const refreshPage = () => {
    const resourceType = searchParams.get("resourceType");
    const newUrl =
      isResource && resourceType
        ? `${path}?resourceType=${resourceType}`
        : path;
    router.replace(newUrl);
  };

  async function handleDelete() {
    setLoading(true);
    setMessage(null);
    const result = await deleteItem(
      collectionName,
      id,
      refNameToCollection,
      isResource
    );
    if ("error" in result) {
      setMessage({ type: "error", text: result.error || "An error occurred." });
    } else {
      setMessage({
        type: "success",
        text: "Item deleted successfully.",
      });
      setTimeout(refreshPage, 1000);
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
          {message ? (
            <CardWrapper.CardMessage type={message.type}>
              {message.text}
            </CardWrapper.CardMessage>
          ) : null}
          <CardWrapper.CardButtons>
            <Button
              onClick={handleDelete}
              variation="danger"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
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
