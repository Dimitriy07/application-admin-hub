"use client";
import Modal from "./Modal";
import Button from "./Button";
import CardWrapper from "./CardWrapper";
import { deleteItem } from "@/app/_services/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DeleteModal({
  id,
  collectionName,
  isResource = true,
}: {
  id: string;
  collectionName: string;
  isResource?: boolean;
}) {
  const path = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  async function handleDelete() {
    try {
      await deleteItem(collectionName, id, isResource);
      const resourceType = params.get("resourceType");
      router.replace(`${path}?resourceType=${resourceType}`);
    } catch (err) {
      console.error("The Item wasn't deleted." + err);
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
