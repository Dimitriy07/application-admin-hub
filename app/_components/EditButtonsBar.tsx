"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "./Button";

function EditButtonsBar({ formId }: { formId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit");
  const isDirty = searchParams.get("isDirty");
  const router = useRouter();
  const handleEditCancelClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.has("edit")) {
      params.delete("edit");
    } else {
      params.set("edit", "true");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  // const handleCancelClick = () => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.delete("edit");
  //   router.push(`${pathname}?${params.toString()}`, { scroll: false });
  // };
  return (
    <>
      {!isEdit ? (
        <Button onClick={handleEditCancelClick}>Edit</Button>
      ) : (
        <div className="flex w-full justify-between">
          {/* <EditButton action="save" /> */}
          <Button disabled={!!!isDirty} type="submit" form={formId}>
            Save
          </Button>
          <Button variation="secondary" onClick={handleEditCancelClick}>
            Cancel
          </Button>
        </div>
      )}
    </>
  );
}

export default EditButtonsBar;
