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

  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const getNewUrl = useCallback(
    () => `${pathname}?${params.toString()}`,
    [pathname, params]
  );

  // CLEAR EDIT PARAMS WHEN THE PAGE IS REFRESHED
  useEffect(function () {
    if (isEdit && searchParams.get("edit") === "true") {
      params.delete("edit");
      router.replace(getNewUrl());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //TAKE NEW DEFAULT VALUE AFTER SUBMISSION OR RESET FORM
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

  //TO MONITOR IF FORM DATA IS CHANGED SO IT CAN BE SAVED
  useEffect(
    function () {
      //IF FIELDS ARE DIRTY - ADD ISDIRTY PARAMS TO MONITOR FOR SAVE BUTTON
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

  //RESET TO DEFAULT VALUE ON CANCEL (FIELDS ARE DIRTY AND NO EDIT)
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
