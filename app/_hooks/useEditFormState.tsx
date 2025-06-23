import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { FormConfigWithConditions } from "@/app/_types/types";

type ModalType = {
  openName: string | undefined;
  close: () => void;
  open: Dispatch<SetStateAction<string | undefined>>;
};

/**
 * Hook to manage form state logic in edit mode.
 * Tracks dirty form fields, resets data after submission or cancel,
 * and manages URL search parameters (`edit`, `isDirty`) for control.
 *
 * @param isEdit - Flag indicating if the form is in edit mode.
 * @param isDirty - Flag from React Hook Form to determine if fields were changed.
 * @param isSubmitSuccessful - Flag indicating if the form was successfully submitted.
 * @param reset - React Hook Form reset function to reset field values.
 * @param completedDefaults - The default values to reset to (typically from DB).
 * @param context - Optional modal context for closing modal on success.
 * @param close - Optional function to close modal manually.
 */
function useEditFormState(
  isEdit: boolean,
  isDirty: boolean,
  isSubmitSuccessful: boolean,
  reset: (data?: FormConfigWithConditions) => void,
  completedDefaults: FormConfigWithConditions,
  context: ModalType | null,
  close?: () => void
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Clone query string for manipulation
  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  // Construct updated URL
  const getNewUrl = useCallback(
    () => `${pathname}?${params.toString()}`,
    [pathname, params]
  );

  /**
   * Effect 1: On mount, if `edit=true` is in URL, clean it up.
   */
  useEffect(function () {
    if (isEdit && searchParams.get("edit") === "true") {
      params.delete("edit");
      router.replace(getNewUrl());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect 2: When form is submitted successfully.
   * - In edit mode: Refresh and clean up `edit` param, optionally close modal.
   * - In add mode: Just reset the form.
   */
  useEffect(() => {
    if (!isSubmitSuccessful) return;

    if (isEdit) {
      params.delete("edit");
      router.refresh();
      router.replace(getNewUrl());
      if (context && close) close();
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  /**
   * Effect 3: Track dirty fields to control URL state (`isDirty`).
   * This is useful for conditional "Save" or "Cancel" buttons.
   */
  useEffect(
    function () {
      if (isDirty && searchParams.get("isDirty") !== "true") {
        params.set("isDirty", "true");
        router.push(getNewUrl());
      }

      if (!isDirty && searchParams.get("isDirty") === "true") {
        params.delete("isDirty");
        router.replace(getNewUrl());
      }
    },
    [isDirty, router, searchParams, getNewUrl, params]
  );

  /**
   * Effect 4: If form is dirty and not in edit mode (e.g., user cancels),
   * revert to initial default values.
   */
  useEffect(
    function () {
      if (isDirty && !isEdit) {
        reset(completedDefaults);
      }
    },
    [completedDefaults, isDirty, isEdit, reset]
  );
}

export default useEditFormState;
